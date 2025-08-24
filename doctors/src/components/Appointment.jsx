import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiUser,
  FiCalendar,
  FiClock,
  FiFileText,
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

const Appointment = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Create an axios instance with JWT token
  const axiosInstance = () => {
    const token = localStorage.getItem("doctorToken");
    const instance = axios.create({
      baseURL: "http://localhost:4000",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return instance;
  };

  
  const fetchAppointment = async () => {
    try {
      const response = await axiosInstance().get(`/app/${appointmentId}`);
      setAppointment(response.data.appointment);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      toast.error("Failed to fetch appointment details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [appointmentId]);

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === appointment.status) return;

    setUpdatingStatus(true);
    try {
      await axiosInstance().patch(
        `/doctors/appointments/${appointmentId}/status`,
        {
          status: newStatus,
        }
      );

      setAppointment({ ...appointment, status: newStatus });
      toast.success(`Appointment status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update appointment status");
    } finally {
      setUpdatingStatus(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Appointment Not Found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
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
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Appointment Details
            </h1>
            <div></div> {/* Spacer */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Appointment Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Appointment Details
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Appointment ID:{" "}
                  <span className="font-mono text-gray-800">
                    #{appointment._id.slice(-8).toUpperCase()}
                  </span>
                </p>

                {/* Status Update Section */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Status
                      </label>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Update Status
                      </label>
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusUpdate(e.target.value)}
                        disabled={updatingStatus}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {updatingStatus && (
                        <div className="mt-1 text-xs text-gray-500">
                          Updating...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-8">
          {/* Appointment Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Patient Information */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <FiUser className="h-5 w-5 text-blue-600" />
                </div>
                Patient Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </label>
                    <p className="text-lg font-medium text-gray-900">
                      {appointment.patient?.name || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </label>
                    <p className="text-lg font-medium text-gray-900">
                      {appointment.patient?.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Information */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <FiCalendar className="h-5 w-5 text-green-600" />
                </div>
                Appointment Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </label>
                    <p className="text-lg font-medium text-gray-900">
                      {appointment.date
                        ? new Date(appointment.date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </label>
                    <p className="text-lg font-medium text-gray-900">
                      {appointment.date
                        ? new Date(appointment.date).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <FiFileText className="h-4 w-4 text-purple-600" />
              </div>
              Reason for Visit
            </h3>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-gray-900 leading-relaxed">
                {appointment.reason || "No reason provided"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            {appointment.status === "completed" && (
              <button
                onClick={() => navigate(`/prescription/${appointment._id}`)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-sm hover:shadow-md"
              >
                <FiFileText className="h-5 w-5" />
                <span>Create Prescription</span>
              </button>
            )}
            <button
              onClick={() => navigate("/")}
              className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium border border-gray-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Appointment;
