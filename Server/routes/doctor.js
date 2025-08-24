import express from "express";
import { getDoctors, getDoctorAppointments, updateAppointmentStatus } from "../controllers/doctor.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/all", getDoctors);
router.get("/appointments", authMiddleware, getDoctorAppointments);
router.patch("/appointments/:appointmentId/status", authMiddleware, updateAppointmentStatus);

export default router;
