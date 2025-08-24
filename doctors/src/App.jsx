import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Appointment from "./components/Appointment";
import Prescription from "./components/Prescription";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/appointment/:appointmentId" element={<Appointment />} />
        <Route path="/prescription/:appointmentId" element={<Prescription />} />
      </Routes>
    </Router>
  );
};

export default App;
