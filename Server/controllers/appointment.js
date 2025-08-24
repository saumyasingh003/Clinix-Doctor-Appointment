import Appointment from "../models/appointment.js";
import User from "../models/user.js";
export const bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, reason } = req.body;

    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ message: "Patient not found" });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      status: { $in: ["pending", "confirmed"] }
    });

    if (existingAppointment) {
      return res.status(409).json({ message: "Doctor already has an appointment at this time" });
    }

    let appointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      date,
      reason,
    });

    await appointment.save();
    appointment = await appointment.populate([
      { path: "doctor", select: "name email" },
      { path: "patient", select: "name email" },
    ]);

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error booking appointment", error: error.message });
  }
};
export const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user.id;

    const appointments = await Appointment.find({ patient: patientId })
      .populate("doctor", "name email")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      totalAppointments: appointments.length,
      appointments,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Error fetching patient appointments",
      error: error.message,
    });
  }
};
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "name email")
      .populate("patient", "name email")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      totalAppointments: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};
export const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate("doctor", "name email")
      .populate("patient", "name email");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching appointment",
      error: error.message,
    });
  }
};
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this appointment" });
    }

    appointment.status = status;
    await appointment.save();

    await appointment.populate("patient", "name email");

    res.status(200).json({
      success: true,
      message: "Appointment status updated",
      appointment,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Error updating appointment status",
      error: error.message,
    });
  }
};
