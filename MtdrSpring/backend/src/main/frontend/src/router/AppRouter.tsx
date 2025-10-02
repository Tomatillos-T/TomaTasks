import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Layout from "../components/Layout";
import TomaTaskMockup from "../pages/TomaTaskMockUp";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/palette" element={<TomaTaskMockup />} />
      <Route path="/login" element={<Login />} />

      {/* Rutas del dashboard con sidebar fijo */}
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
