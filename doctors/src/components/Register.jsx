import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom"; // For navigation to login page

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("DOCTOR"); // default role
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/auth/register", {
        name,
        email,
        password,
        role,
      });
      toast.success("Registration successful!");
      console.log(res.data);
      // Optional: Clear form after registration
      setName("");
      setEmail("");
      setPassword("");
      setRole("DOCTOR");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen relative flex items-center justify-center">
      {/* Background image */}
      <img
        src="/doctor.jpeg"
        alt="background"
        className="absolute w-full h-full object-cover"
      />
      {/* Dark overlay */}
      <div className="absolute w-full h-full  bg-opacity-40"></div>

      {/* Register form */}
      <div className="relative ml-180 bg-white bg-opacity-90 p-12 rounded-3xl shadow-xl flex flex-col gap-6 w-96 z-10">
        <h2 className="text-4xl font-extrabold text-center text-gray-800">
          Register
        </h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-4 border border-gray-300 rounded-xl text-lg"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-4 border border-gray-300 rounded-xl text-lg"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-4 border border-gray-300 rounded-xl text-lg"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-4 border border-gray-300 rounded-xl text-lg"
        >
          <option value="DOCTOR">DOCTOR</option>
          <option value="PATIENT">PATIENT</option>
        </select>

        <button
          onClick={handleRegister}
          className="bg-blue-600 text-white p-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-gray-700">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default RegisterPage;
