import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import BookAppointment from "./components/BookAppointment";
import MyAppointments from "./components/MyAppointments";
import MyPrescriptions from "./components/MyPrescriptions";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/my-prescriptions" element={<MyPrescriptions />} />
      </Routes>
    </Router>
  );
};

export default App;
