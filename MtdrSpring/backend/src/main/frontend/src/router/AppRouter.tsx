import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Home from "../pages/home";
import Dashboard from "../pages/dashboard";
import Layout from "../components/layout";
import TomaTaskMockup from "../pages/TomaTaskMockUp";
import ProjectForm from "../modules/projects/components/projectForm";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/palette" element={<TomaTaskMockup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/projectForm" element={<ProjectForm />} />


      {/* Rutas del dashboard con sidebar fijo */}
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
