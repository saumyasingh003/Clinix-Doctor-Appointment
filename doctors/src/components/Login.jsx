import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react"; // Using lucide-react for eye icons

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // toggle state
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/auth/login", {
        email,
        password,
      });
      toast.success("Login successful!");
      console.log(response.data);
      localStorage.setItem("doctorToken", response.data?.token)

      // Redirect to home page
      navigate("/"); 
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Try again."
      );
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
      <div className="absolute w-full h-full bg-opacity-40"></div>

      {/* Login form */}
      <div className="relative ml-180 bg-white bg-opacity-90 p-12 rounded-3xl shadow-xl flex flex-col gap-6 w-96 z-10">
        <h2 className="text-4xl font-extrabold text-center text-gray-800">
          Login
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-4 border border-gray-300 rounded-xl text-lg"
        />

        {/* Password input with eye toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-4 border border-gray-300 rounded-xl text-lg w-full pr-12"
          />
          <div
            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="text-black bg-gray-400 p-4 rounded-2xl text-lg font-bold"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-700">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Login;
