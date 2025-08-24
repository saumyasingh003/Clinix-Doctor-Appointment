import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "./db.js";
import User from "./models/user.js";
dotenv.config();
await connectDB();

const doctors = [
  { name: "Dr. Arjun", email: "arjun@clinix.com", specialization: "Cardiology" },
  { name: "Dr. Neha",  email: "neha@clinix.com",  specialization: "Dermatology" }
];

for (const d of doctors) {
  const exists = await User.findOne({ email: d.email });
  if (exists) continue;
  const password = await bcrypt.hash("password123", 10);
  await User.create({ ...d, password, role: "DOCTOR" });
}
console.log("Seeded doctors");
process.exit(0);
