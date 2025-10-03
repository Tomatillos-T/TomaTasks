import React from "react";
import { Bell, ChevronDown, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-background-paper border-b border-background-contrast shadow-sm">
      <div className="px-4 md:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-main flex items-center justify-center text-2xl">
            🍅
          </div>
          {/* Mostrar título solo en pantallas grandes */}
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-text-primary">TomaTask</h1>
            <p className="text-xs text-text-secondary">ERP Management System</p>
          </div>
        </div>

        {/* Search: mostrar solo en pantallas medianas y grandes */}
        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Buscar productos, clientes, tareas..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-background-contrast bg-background-paper text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-main placeholder:text-text-secondary"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-background-subtle transition-colors"
          >
            {theme === "light" ? (
              <Sun className="w-5 h-5 text-text-secondary" />
            ) : (
              <Moon className="w-5 h-5 text-text-secondary" />
            )}
          </button>

          <button className="relative p-2 rounded-lg hover:bg-background-subtle transition-colors">
            <Bell className="w-5 h-5 text-text-secondary" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error-main rounded-full"></span>
          </button>

          {/* Perfil */}
          <div className="flex items-center gap-3 pl-4 border-l border-background-contrast">
            {/* Solo icono en pantallas pequeñas */}
            <div className="w-9 h-9 rounded-full bg-secondary-main flex items-center justify-center text-white font-semibold">
              JD
            </div>
            {/* Nombre solo en pantallas medianas y grandes */}
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-text-primary">John Doe</p>
              <p className="text-xs text-text-secondary">Administrador</p>
            </div>
            <ChevronDown className="w-4 h-4 text-text-secondary" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
