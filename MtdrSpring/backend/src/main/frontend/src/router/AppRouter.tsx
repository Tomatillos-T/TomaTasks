import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import KPIReports from "@/pages/KPIReports";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleBasedRoute from "@/components/RoleBasedRoute";
import TomaTaskMockup from "@/pages/TomaTaskMockUp";
import Kanban from "@/pages/Kanban";
import Equipos from "@/pages/Equipos";
import Proyectos from "@/pages/Proyectos";
import Calendario from "@/pages/Calendario";
import SprintForm from "@/modules/sprint/components/SprintForm";
import ProjectForm from "@/modules/projects/components/ProjectForm";
import User from "@/pages/User";
import Users from "@/pages/Users";
import Tasks from "@/pages/task/Tasks";
import RedirectionRoute from "@/components/RedirectionRoute";
import LoginRoute from "@/components/LoginRoute";
import Equipo from "@/pages/Equipo";

// Definición de las rutas de la aplicación

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginRoute />} />

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
        <Route path="/kpi-reports" element={<KPIReports />} />
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
          path="/projectForm"
          element={
            <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}>
              <ProjectForm />
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
          path="/usuarios"
          element={
            <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}>
              <Users />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/equipos/:id"
          element={
            <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}>
              <Equipo />
            </RoleBasedRoute>
          }
        />
        <Route path="*" element={<RedirectionRoute redirect="/dashboard" />} />
      </Route>
    </Routes>
  );
}
