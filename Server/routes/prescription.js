import express from "express";
import {
  createPrescription,
  getPrescriptionByAppointment,
  getPatientPrescriptions,
  getDoctorPrescriptions
} from "../controllers/prescription.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/:appointmentId", authMiddleware, createPrescription);
router.get("/:appointmentId", authMiddleware, getPrescriptionByAppointment);
router.get("/patient/my-prescriptions", authMiddleware, getPatientPrescriptions);
router.get("/doctor/my-prescriptions", authMiddleware, getDoctorPrescriptions);

export default router;
