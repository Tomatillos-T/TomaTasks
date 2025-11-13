import { Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleBasedRoute from "@/components/RoleBasedRoute";
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

// Definición de las rutas de la aplicación

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas del dashboard con sidebar fijo */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Rutas accesibles para todos los usuarios autenticados */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tareas" element={<Tasks />} />
        <Route path="/kanban" element={<Kanban />} />
        <Route path="/user" element={<User />} />

        {/* Rutas solo para ADMIN */}
        <Route
          path="/equipos"
          element={
            <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}>
              <Equipos />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/proyectos"
          element={
            <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}>
              <Proyectos />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/calendario"
          element={
            <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}>
              <Calendario />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/palette"
          element={
            <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}>
              <TomaTaskMockup />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/projectForm"
          element={
            <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}>
              <ProjectForm />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/teamForm"
          element={
            <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}>
              <TeamForm />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/sprintForm"
          element={
            <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}>
              <SprintForm />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/userStoryForm"
          element={
            <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}>
              <UserStoryForm />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/taskForm"
          element={
            <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}>
              <TaskForm />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/generate-dummy-tasks"
          element={
            <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}>
              <GenerateDummyTasks />
            </RoleBasedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
