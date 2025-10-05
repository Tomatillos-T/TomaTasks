import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Layout from "../components/Layout";
import TomaTaskMockup from "../pages/TomaTaskMockUp";
import ProjectForm from "../modules/projects/components/ProjectForm";


export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Rutas del dashboard con sidebar fijo */}
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="/palette" element={<TomaTaskMockup />} />  
        <Route path="/projectForm" element={<ProjectForm />} />  

      </Route>
    </Routes>
  );
}
