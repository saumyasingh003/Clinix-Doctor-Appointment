import User from "../models/user.js";
import Appointment from "../models/appointment.js";

export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });

    res.status(200).json({
      success: true,
      totalDoctors: doctors.length,
      doctors,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Error fetching doctors",
      error: error.message,
    });
  }
};
export const getDoctorAppointments = async (req, res) => {
  try { 
 
    const doctorId = req.user.id;
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate("patient", "name email")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      totalAppointments: appointments.length,
      appointments,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
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

    res.status(200).json({
      success: true,
      message: "Appointment status updated",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating appointment status",
      error: error.message,
    });
  }
};
