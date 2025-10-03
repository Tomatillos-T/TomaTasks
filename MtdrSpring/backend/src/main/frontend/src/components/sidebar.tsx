import React, { useState } from "react";
import { BarChart3, Calendar, FileText, Package, Settings, Users, Menu, X } from "lucide-react";

type SidebarProps = {
  activeTab: string;
  setActiveTab: (id: string) => void;
};

const navItems = [
  { id: "dashboard", icon: BarChart3, label: "Dashboard", color: "primary" },
  { id: "tasks", icon: FileText, label: "Tareas", color: "tertiary" },
  { id: "clients", icon: Users, label: "Clientes", color: "info" },
  { id: "inventory", icon: Package, label: "Inventario", color: "warning" },
  { id: "calendar", icon: Calendar, label: "Calendario", color: "secondary" },
  { id: "settings", icon: Settings, label: "Configuración", color: "text" },
] as const;

const colorClasses = {
  primary: { active: "bg-primary-main text-primary-contrast", inactive: "text-gray-600 hover:bg-gray-100" },
  secondary: { active: "bg-secondary-main text-secondary-contrast", inactive: "text-gray-600 hover:bg-gray-100" },
  tertiary: { active: "bg-tertiary-main text-tertiary-contrast", inactive: "text-gray-600 hover:bg-gray-100" },
  warning: { active: "bg-warning-bg text-warning-contrast", inactive: "text-gray-600 hover:bg-gray-100" },
  info: { active: "bg-info-bg text-info-contrast", inactive: "text-gray-600 hover:bg-gray-100" },
  text: { active: "bg-gray-200 text-gray-800", inactive: "text-gray-600 hover:bg-gray-100" },
};

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón para móviles */}
      <button
        className="p-2 m-2 rounded-md bg-background-paper shadow-md md:hidden fixed z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-background-paper border-r border-background-contrast
          w-64 p-4 space-y-1 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:block
          z-40
        `}
      >
        <nav className="space-y-1">
          {navItems.map(({ id, icon: Icon, label, color }) => {
            const isActive = activeTab === id;
            const classes = isActive ? colorClasses[color].active : colorClasses[color].inactive;

            return (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setIsOpen(false); // cerrar en móviles al seleccionar
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${classes}`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Fondo oscuro al abrir en móviles */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
