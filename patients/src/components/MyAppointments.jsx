import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiCalendar, FiClock, FiUser, FiArrowLeft, FiCheck, FiX, FiEye } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

const MyAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create an axios instance with JWT token
  const axiosInstance = () => {
    const token = localStorage.getItem("patientToken");
    const instance = axios.create({
      baseURL: "http://localhost:4000",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return instance;
  };

  // Fetch patient appointments
  const fetchAppointments = async () => {
    try {
      const response = await axiosInstance().get("/app/my-appointments");
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <FiCheck className="h-4 w-4" />;
      case "completed":
        return <FiCheck className="h-4 w-4" />;
      case "cancelled":
        return <FiX className="h-4 w-4" />;
      default:
        return <FiClock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <FiArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
            <div></div> {/* Spacer */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Total Appointments: <span className="font-semibold">{appointments.length}</span>
          </p>
          <Link
            to="/book-appointment"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <FiCalendar className="h-4 w-4" />
            <span>Book New Appointment</span>
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <FiCalendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-500 mb-6">You haven't booked any appointments yet.</p>
            <Link
              to="/book-appointment"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Book Your First Appointment
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                {/* Doctor Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiUser className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Dr. {appointment.doctor?.name || "Unknown"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {appointment.doctor?.email || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FiCalendar className="h-4 w-4" />
                    <span className="text-sm">
                      {appointment.date ? new Date(appointment.date).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FiClock className="h-4 w-4" />
                    <span className="text-sm">
                      {appointment.date ? new Date(appointment.date).toLocaleTimeString() : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="mb-4">
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {getStatusIcon(appointment.status)}
                    <span className="capitalize">{appointment.status}</span>
                  </span>
                </div>

                {/* Reason */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Reason:</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {appointment.reason || "No reason provided"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  {appointment.status === "completed" && (
                    <Link
                      to={`/my-prescriptions`}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-center text-sm"
                    >
                      View Prescription
                    </Link>
                  )}
                  <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 text-sm flex items-center justify-center space-x-1">
                    <FiEye className="h-4 w-4" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyAppointments;
