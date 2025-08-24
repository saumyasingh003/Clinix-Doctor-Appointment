import Prescription from "../models/prescription.js";
import Appointment from "../models/appointment.js";

export const createPrescription = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { symptoms, diagnosis, medicines, additionalNotes } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status !== "completed") {
      return res.status(400).json({ message: "Appointment is not completed yet" });
    }

    const existing = await Prescription.findOne({ appointment: appointmentId });
    if (existing) {
      return res.status(400).json({ message: "Prescription already exists for this appointment" });
    }

    const prescription = await Prescription.create({
      appointment: appointmentId,
      doctor: appointment.doctor,
      patient: appointment.patient,
      symptoms,
      diagnosis,
      medicines,
      additionalNotes,
    });

    res.status(201).json({
      success: true,
      message: "Prescription created",
      prescription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating prescription",
      error: error.message,
    });
  }
};
export const getPrescriptionByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const prescription = await Prescription.findOne({ appointment: appointmentId })
      .populate("doctor", "name email")
      .populate("patient", "name email");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.status(200).json({ success: true, prescription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getPatientPrescriptions = async (req, res) => {
  try {
    const patientId = req.user.id;

    const prescriptions = await Prescription.find({ patient: patientId })
      .populate("doctor", "name email")
      .populate("appointment")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalPrescriptions: prescriptions.length,
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching prescriptions",
      error: error.message,
    });
  }
};
export const getDoctorPrescriptions = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const prescriptions = await Prescription.find({ doctor: doctorId })
      .populate("patient", "name email")
      .populate("appointment")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalPrescriptions: prescriptions.length,
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching prescriptions",
      error: error.message,
    });
  }
};
