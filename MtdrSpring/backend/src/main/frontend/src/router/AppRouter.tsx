import { Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Layout from "@/components/Layout";
import TomaTaskMockup from "@/pages/TomaTaskMockUp";
import Kanban from "@/pages/Kanban";
import Equipos from "@/pages/Equipos";
import Proyectos from "@/pages/Proyectos";
import Calendario from "@/pages/Calendario";
import TeamForm from "@/modules/teams/components/TeamForm";
import SprintForm from "@/modules/sprint/components/SprintForm";
import ProjectForm from "@/modules/projects/components/ProjectForm";
import UserStoryForm from "@/modules/userStory/components/UserStoryForm";
import TaskForm from "@/modules/task/components/TaskForm";
import User from "@/pages/User";
import Tasks from "@/pages/task/Tasks";
import GenerateDummyTasks from "@/pages/GenerateDummyTasks";
import Equipo from "@/pages/Equipo";

// Definición de las rutas de la aplicación

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Rutas del dashboard con sidebar fijo */}
      <Route path="/" element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tareas" element={<Tasks />} />
        <Route path="/kanban" element={<Kanban />} />
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/proyectos" element={<Proyectos />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/palette" element={<TomaTaskMockup />} />
        <Route path="/projectForm" element={<ProjectForm />} />
        <Route path="/teamForm" element={<TeamForm />} />
        <Route path="/sprintForm" element={<SprintForm />} />
        <Route path="/userStoryForm" element={<UserStoryForm />} />
        <Route path="/taskForm" element={<TaskForm />} />
        <Route path="/user" element={<User />} />
        <Route path="/generate-dummy-tasks" element={<GenerateDummyTasks />} />

        <Route path="/equipos/:id" element={<Equipo />} />
      </Route>
    </Routes>
  );
}
