import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Layout from "../components/Layout";
import TomaTaskMockup from "../pages/TomaTaskMockUp";
import ProjectForm from "../modules/projects/components/ProjectForm";
import Tareas from "../pages/Tareas";
import Kanban from "../pages/Kanban";
import Equipos from "../pages/Equipos";
import Proyectos from "../pages/Proyectos";
import Calendario from "../pages/Calendario";
import TeamForm from "../modules/teams/components/TeamForm";
import SprintForm from "../modules/sprint/components/SprintForm";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Rutas del dashboard con sidebar fijo */}
      <Route path="/" element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tareas" element={<Tareas />} />
        <Route path="/kanban" element={<Kanban />} />
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/proyectos" element={<Proyectos />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/palette" element={<TomaTaskMockup />} />  
        <Route path="/projectForm" element={<ProjectForm />} />  
        <Route path="/teamForm" element={<TeamForm />} />  
        <Route path="/sprintForm" element={<SprintForm />} />  


      </Route>
    </Routes>
  );
}
