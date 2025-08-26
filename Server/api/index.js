import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "../db.js";

import authRoutes from "../routes/user.js";
import appointmentRoutes from '../routes/appointment.js';
import doctorRoutes from '../routes/doctor.js';
import  prescriptionRoutes from '../routes/prescription.js'

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_, res) => {
  res.json({ ok: true, name: "Clinix Sphere API" });
});

app.use("/auth", authRoutes);
app.use("/app", appointmentRoutes );
app.use("/doctors", doctorRoutes);
app.use("/prescriptions",  prescriptionRoutes);

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`API running at: http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error(" Failed to connect to DB", err);
    process.exit(1);
  }
};

startServer();
