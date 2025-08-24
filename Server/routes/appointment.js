import express from "express";
import {
  bookAppointment,
  getPatientAppointments,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus
} from "../controllers/appointment.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/book", authMiddleware, bookAppointment);
router.get("/my-appointments", authMiddleware, getPatientAppointments);
router.patch("/:appointmentId/status", authMiddleware, updateAppointmentStatus);
router.get("/:appointmentId", authMiddleware, getAppointmentById);
router.get("/", authMiddleware, getAllAppointments);

export default router;
