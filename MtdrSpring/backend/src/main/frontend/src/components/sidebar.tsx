import React, { useState } from "react";
import { BarChart3, Calendar, FileText, Package, Settings, Users, Menu, X } from "lucide-react";

type SidebarProps = {
  activeTab: string;
  setActiveTab: (id: string) => void;
};

const navItems = [
  { id: "dashboard", icon: BarChart3, label: "Dashboard" },
  { id: "tasks", icon: FileText, label: "Tareas" },
  { id: "clients", icon: Users, label: "Clientes" },
  { id: "inventory", icon: Package, label: "Inventario" },
  { id: "calendar", icon: Calendar, label: "Calendario" },
  { id: "settings", icon: Settings, label: "Configuración" },
] as const;

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón para móviles */}
      <button
        className="p-2 m-2 rounded-md bg-background-paper border border-background-contrast shadow-md md:hidden fixed z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-text-primary" />
        ) : (
          <Menu className="w-5 h-5 text-text-primary" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen overflow-y-auto bg-background-paper border-r border-background-contrast
          w-64 p-4 space-y-1 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:block
          z-40
        `}
      >
        <nav className="space-y-1">
          {navItems.map(({ id, icon: Icon, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                  isActive
                    ? "bg-primary-main text-primary-contrast"
                    : "text-text-secondary hover:bg-background-subtle"
                }`}
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