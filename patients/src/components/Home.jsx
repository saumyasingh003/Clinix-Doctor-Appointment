import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiCalendar, FiFileText, FiUser, FiLogOut } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const axiosInstance = () => {
    const token = localStorage.getItem("patientToken");
    const instance = axios.create({
      baseURL: "http://localhost:4000",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          toast.error("Patient not authorized. Please login.");
          localStorage.removeItem("patientToken");
          navigate("/login");
        } else {
          toast.error(error.response?.data?.message || "Something went wrong!");
        }
        return Promise.reject(error);
      }
    );

    return instance;
  };

  useEffect(() => {
    const token = localStorage.getItem("patientToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("patientToken");
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("patientToken");
    toast.success("Logged out successfully!");
    navigate("/login");
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
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
         
              <h1 className="text-2xl font-bold text-gray-900">Clinix Sphere - Patient Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 hidden md:block">Welcome, {user?.name || "Patient"}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiLogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Health Portal</h2>
          <p className="text-gray-600">Manage your healthcare needs with ease and convenience</p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Book Appointment */}
          <Link
            to="/book-appointment"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-6 mx-auto group-hover:scale-105 transition-transform duration-200">
              <FiCalendar className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Book Appointment</h3>
            <p className="text-gray-600 text-center text-sm leading-relaxed">Schedule appointments with our qualified doctors and specialists</p>
          </Link>

          {/* My Appointments */}
          <Link
            to="/my-appointments"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md hover:border-green-200 transition-all duration-200 group"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mb-6 mx-auto group-hover:scale-105 transition-transform duration-200">
              <FiUser className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">My Appointments</h3>
            <p className="text-gray-600 text-center text-sm leading-relaxed">View and manage your scheduled appointments and their status</p>
          </Link>

          {/* My Prescriptions */}
          <Link
            to="/my-prescriptions"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md hover:border-purple-200 transition-all duration-200 group"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl mb-6 mx-auto group-hover:scale-105 transition-transform duration-200">
              <FiFileText className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">My Prescriptions</h3>
            <p className="text-gray-600 text-center text-sm leading-relaxed">Access your medical prescriptions and treatment records</p>
          </Link>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">How It Works</h3>
            <p className="text-gray-600">Your healthcare journey in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 mx-auto shadow-lg group-hover:scale-105 transition-transform duration-200">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-blue-200 -z-10"></div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Book Appointment</h4>
              <p className="text-gray-600 leading-relaxed">Choose from our qualified doctors and schedule your appointment at your convenience</p>
            </div>

            <div className="text-center group">
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 mx-auto shadow-lg group-hover:scale-105 transition-transform duration-200">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-green-200 -z-10"></div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Visit Doctor</h4>
              <p className="text-gray-600 leading-relaxed">Attend your appointment and receive personalized professional medical care</p>
            </div>

            <div className="text-center group">
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6 mx-auto shadow-lg group-hover:scale-105 transition-transform duration-200">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Get Digital Prescription</h4>
              <p className="text-gray-600 leading-relaxed">Receive and access your digital prescriptions securely in your patient portal</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h4>
            <p className="text-gray-600 text-sm">
              Contact our support team at{" "}
              <a href="mailto:support@clinixsphere.com" className="text-blue-600 hover:text-blue-700 font-medium">
                support@clinixsphere.com
              </a>{" "}
              or call us at{" "}
              <span className="font-medium text-gray-900">1-800-CLINIX</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
