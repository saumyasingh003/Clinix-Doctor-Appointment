import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import doctorApi from '../utils/api';

const Prescription = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState({
    symptoms: '',
    diagnosis: '',
    medicines: [{ name: '', dosage: '', duration: '' }],
    additionalNotes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Create an axios instance with JWT token


  // Fetch appointment details
  const fetchAppointment = async () => {
    try {
      const response = await doctorApi.get(`/app/${appointmentId}`);
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

  // Handle medicine input changes
  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...prescriptionData.medicines];
    updatedMedicines[index][field] = value;
    setPrescriptionData({ ...prescriptionData, medicines: updatedMedicines });
  };

  // Add new medicine
  const addMedicine = () => {
    setPrescriptionData({
      ...prescriptionData,
      medicines: [...prescriptionData.medicines, { name: '', dosage: '', duration: '' }]
    });
  };

  // Remove medicine
  const removeMedicine = (index) => {
    const updatedMedicines = prescriptionData.medicines.filter((_, i) => i !== index);
    setPrescriptionData({ ...prescriptionData, medicines: updatedMedicines });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await doctorApi.post(`/prescriptions/${appointmentId}`, prescriptionData);
      toast.success("Prescription created successfully!");
      navigate('/');
    } catch (error) {
      console.error("Error creating prescription:", error);
      toast.error(error.response?.data?.message || "Failed to create prescription");
    } finally {
      setSubmitting(false);
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Appointment Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Prescription</h1>

          {/* Patient Information */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Patient Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                <p className="mt-1 text-lg text-gray-900">{appointment.patient?.name || "N/A"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient Email</label>
                <p className="mt-1 text-lg text-gray-900">{appointment.patient?.email || "N/A"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Appointment Date</label>
                <p className="mt-1 text-lg text-gray-900">
                  {appointment.date ? new Date(appointment.date).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Appointment Time</label>
                <p className="mt-1 text-lg text-gray-900">
                  {appointment.date ? new Date(appointment.date).toLocaleTimeString() : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Symptoms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Symptoms
              </label>
              <textarea
                value={prescriptionData.symptoms}
                onChange={(e) => setPrescriptionData({ ...prescriptionData, symptoms: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter patient symptoms..."
                required
              />
            </div>

            {/* Diagnosis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnosis
              </label>
              <textarea
                value={prescriptionData.diagnosis}
                onChange={(e) => setPrescriptionData({ ...prescriptionData, diagnosis: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter diagnosis..."
                required
              />
            </div>

            {/* Medicines */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Medicines
                </label>
                <button
                  type="button"
                  onClick={addMedicine}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <FiPlus /> Add Medicine
                </button>
              </div>

              <div className="space-y-4">
                {prescriptionData.medicines.map((medicine, index) => (
                  <div key={index} className="flex gap-4 items-end p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Medicine Name
                      </label>
                      <input
                        type="text"
                        value={medicine.name}
                        onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Paracetamol"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dosage
                      </label>
                      <input
                        type="text"
                        value={medicine.dosage}
                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 500mg"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={medicine.duration}
                        onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 7 days"
                        required
                      />
                    </div>
                    {prescriptionData.medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicine(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={prescriptionData.additionalNotes}
                onChange={(e) => setPrescriptionData({ ...prescriptionData, additionalNotes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional instructions or notes..."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creating Prescription...' : 'Create Prescription'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Prescription;
