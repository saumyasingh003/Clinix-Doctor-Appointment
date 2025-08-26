import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiFileText, FiUser, FiCalendar, FiArrowLeft, FiDownload } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import patientApi from "../utils/api";

const MyPrescriptions = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);



  // Fetch patient prescriptions
  const fetchPrescriptions = async () => {
    try {
      const response = await patientApi.get("/prescriptions/patient/my-prescriptions");
      setPrescriptions(response.data.prescriptions || []);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      toast.error("Failed to fetch prescriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

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
            <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>
            <div></div> {/* Spacer */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            Total Prescriptions: <span className="font-semibold">{prescriptions.length}</span>
          </p>
        </div>

        {prescriptions.length === 0 ? (
          <div className="text-center py-12">
            <FiFileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
            <p className="text-gray-500 mb-6">You don't have any prescriptions yet.</p>
            <button
              onClick={() => navigate("/my-appointments")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              View My Appointments
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {prescriptions.map((prescription) => (
              <div
                key={prescription._id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Prescription #{prescription._id.slice(-8).toUpperCase()}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <FiUser className="h-4 w-4" />
                        <span>{prescription.doctor?.name || "Unknown"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiCalendar className="h-4 w-4" />
                        <span>
                          {new Date(prescription.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 text-sm flex items-center space-x-1">
                    <FiDownload className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                </div>

                {/* Symptoms */}
                {prescription.symptoms && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Symptoms:</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {prescription.symptoms}
                    </p>
                  </div>
                )}

                {/* Diagnosis */}
                {prescription.diagnosis && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Diagnosis:</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {prescription.diagnosis}
                    </p>
                  </div>
                )}

                {/* Medicines */}
                {prescription.medicines && prescription.medicines.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Medicines:</h4>
                    <div className="space-y-3">
                      {prescription.medicines.map((medicine, index) => (
                        <div
                          key={index}
                          className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h5 className="text-sm font-medium text-gray-700">Medicine</h5>
                              <p className="text-sm text-gray-900">{medicine.name}</p>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-gray-700">Dosage</h5>
                              <p className="text-sm text-gray-900">{medicine.dosage}</p>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-gray-700">Duration</h5>
                              <p className="text-sm text-gray-900">{medicine.duration}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                {prescription.additionalNotes && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Notes:</h4>
                    <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                      {prescription.additionalNotes}
                    </p>
                  </div>
                )}

                {/* Appointment Reference */}
                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500">
                    Appointment Reference: {prescription.appointment?._id?.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyPrescriptions;
