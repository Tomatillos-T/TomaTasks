import React, { useState } from "react";
import {
  FileText,
  Users,
  Package,
  BarChart3,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const TomaTaskMockup = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { theme, toggleTheme } = useTheme();

  type StatusType = "success" | "error" | "warning" | "info";

  type StatCardProps = {
    title: string;
    value: string;
    change: number;
    icon: React.ElementType;
    status: StatusType;
  };

  const colorClassesStat: Record<StatusType, { bg: string; text: string }> = {
    success: {
      bg: "bg-success-bg",
      text: "text-success-main",
    },
    error: {
      bg: "bg-error-bg",
      text: "text-error-main",
    },
    warning: {
      bg: "bg-warning-bg",
      text: "text-warning-main",
    },
    info: {
      bg: "bg-info-bg",
      text: "text-info-main",
    },
  };

  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    icon: Icon,
    status,
  }) => (
    <div className="bg-background-paper rounded-xl p-6 shadow-sm border border-background-contrast hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        {/* Icon wrapper */}
        <div className={`p-3 rounded-lg ${colorClassesStat[status].bg}`}>
          <Icon className={`w-6 h-6 ${colorClassesStat[status].text}`} />
        </div>

        {/* Change badge */}
        <span
          className={`text-sm font-semibold px-2 py-1 rounded-full ${
            change >= 0
              ? "bg-[var(--success-bg)] text-[var(--success-dark)]"
              : "bg-[var(--error-bg)] text-[var(--error-dark)]"
          }`}
        >
          {change >= 0 ? "+" : ""}
          {change}%
        </span>
      </div>

      <h3 className="text-sm font-medium mb-1 text-text-secondary">{title}</h3>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
    </div>
  );

  type AlertProps = {
    type: "success" | "error" | "warning" | "info";
    message: string;
  };

  const Alert: React.FC<AlertProps> = ({ type, message }) => {
    const icons = {
      success: CheckCircle,
      error: AlertCircle,
      warning: AlertTriangle,
      info: Info,
    };
    const styles = {
      success: {
        bg: "bg-success-bg",
        text: "text-success-main",
        border: "border-success-main",
        contrast: "text-success-contrast",
      },
      error: {
        bg: "bg-error-bg",
        text: "text-error-main",
        border: "border-error-main",
        contrast: "text-error-contrast",
      },
      warning: {
        bg: "bg-warning-bg",
        text: "text-warning-main",
        border: "border-warning-main",
        contrast: "text-warning-contrast",
      },
      info: {
        bg: "bg-info-bg",
        text: "text-info-main",
        border: "border-info-main",
        contrast: "text-info-contrast",
      },
    } as const;

    const Icon = icons[type];
    const config = styles[type];

    return (
      <div
        className={`rounded-lg p-4 flex items-start gap-3 border-1 ${config.border} ${config.bg}`}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.text}`} />
        <p className={`text-sm font-medium ${config.contrast}`}>{message}</p>
      </div>
    );
  };

  type NavItem = {
    id: string;
    icon: React.ElementType;
    label: string;
    color: "primary" | "secondary" | "tertiary" | "warning" | "info" | "text";
  };

  const navItems: NavItem[] = [
    { id: "dashboard", icon: BarChart3, label: "Dashboard", color: "primary" },
    { id: "tasks", icon: FileText, label: "Tareas", color: "tertiary" },
    { id: "clients", icon: Users, label: "Clientes", color: "info" },
    { id: "inventory", icon: Package, label: "Inventario", color: "warning" },
    { id: "calendar", icon: Calendar, label: "Calendario", color: "secondary" },
    { id: "settings", icon: Settings, label: "Configuración", color: "text" },
  ];

  // Map colors to Tailwind classes
  const colorClasses: Record<
    NavItem["color"],
    { active: string; inactive: string }
  > = {
    primary: {
      active: "bg-primary-main text-primary-contrast",
      inactive: "text-gray-600 hover:bg-gray-100",
    },
    secondary: {
      active: "bg-secondary-main text-secondary-contrast",
      inactive: "text-gray-600 hover:bg-gray-100",
    },
    tertiary: {
      active: "bg-tertiary-main text-tertiary-contrast",
      inactive: "text-gray-600 hover:bg-gray-100",
    },
    warning: {
      active: "bg-warning-bg text-warning-contrast",
      inactive: "text-gray-600 hover:bg-gray-100",
    },
    info: {
      active: "bg-info-bg text-info-contrast",
      inactive: "text-gray-600 hover:bg-gray-100",
    },
    text: {
      active: "bg-gray-200 text-gray-800",
      inactive: "text-gray-600 hover:bg-gray-100",
    },
  };

  function SidebarNav({
    activeTab,
    setActiveTab,
  }: {
    activeTab: string;
    setActiveTab: (id: string) => void;
  }) {
    return (
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const classes = isActive
            ? colorClasses[item.color].active
            : colorClasses[item.color].inactive;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${classes}`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="min-h-screen bg-background-main">
      {/* Header */}
      <header className="bg-background-paper border-b border-background-contrast shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-main flex items-center justify-center text-2xl">
                🍅
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary">
                  TomaTask
                </h1>
                <p className="text-xs text-text-secondary">
                  ERP Management System
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Buscar productos, clientes, tareas..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-background-contrast bg-background-paper text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-main transition-all placeholder:text-text-secondary"
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
              <div className="flex items-center gap-3 pl-4 border-l border-background-contrast">
                <div className="w-9 h-9 rounded-full bg-secondary-main flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    John Doe
                  </p>
                  <p className="text-xs text-text-secondary">Administrador</p>
                </div>
                <ChevronDown className="w-4 h-4 text-text-secondary" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-background-paper border-r border-background-contrast min-h-screen">
          <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-background-subtle">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2 text-text-primary">
                  Dashboard General
                </h2>
                <p className="text-text-secondary">
                  Resumen de actividades y métricas clave
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg border border-background-contrast bg-background-paper font-medium text-text-primary transition-colors hover:bg-background-subtle">
                  Exportar
                </button>
                <button className="px-6 py-2 rounded-lg font-medium text-white bg-primary-main hover:bg-primary-dark transition-all hover:shadow-lg">
                  Nueva Tarea
                </button>
                <button
                  className="px-6 py-2 rounded-lg font-medium text-white bg-primary-main hover:bg-primary-dark transition-all hover:shadow-lg"
                  onClick={toggleTheme}
                >
                  Cambiar Tema
                </button>
              </div>
            </div>

            {/* Alerts Demo */}
            <div className="grid gap-3 mb-6">
              <Alert
                type="success"
                message="¡Excelente! Has completado todas las tareas prioritarias de hoy."
              />
              <Alert
                type="warning"
                message="Atención: 5 productos están por debajo del stock mínimo."
              />
              <Alert
                type="error"
                message="Error: No se pudo sincronizar con el sistema de facturación."
              />
              <Alert
                type="info"
                message="Recordatorio: Reunión de equipo programada para las 3:00 PM."
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Ventas del Mes"
              value="$45,231"
              change={12.5}
              icon={TrendingUp}
              status="success"
            />
            <StatCard
              title="Tareas Activas"
              value="127"
              change={-3.2}
              icon={FileText}
              status="warning"
            />
            <StatCard
              title="Clientes Nuevos"
              value="34"
              change={8.1}
              icon={Users}
              status="info"
            />
            <StatCard
              title="Productos en Stock"
              value="1,284"
              change={-15.3}
              icon={Package}
              status="error"
            />
          </div>

          {/* Color Palette Reference */}
          <div className="bg-background-paper rounded-xl p-6 shadow-sm border border-background-contrast">
            <h3 className="text-lg font-bold mb-6 text-text-primary">
              Sistema de Colores TomaTask
            </h3>

            <div className="space-y-6">
              {/* Primary Colors */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-text-secondary">
                  Colores Primarios
                </h4>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="h-20 rounded-lg mb-2 bg-primary-light"></div>
                    <p className="text-xs font-mono text-text-secondary">
                      Primary Light
                    </p>
                    <p className="text-xs font-mono font-semibold text-text-primary">
                      #FF6B75
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="h-20 rounded-lg mb-2 bg-primary-main"></div>
                    <p className="text-xs font-mono text-text-secondary">
                      Primary Main
                    </p>
                    <p className="text-xs font-mono font-semibold text-text-primary">
                      #E63946
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="h-20 rounded-lg mb-2 bg-primary-dark"></div>
                    <p className="text-xs font-mono text-text-secondary">
                      Primary Dark
                    </p>
                    <p className="text-xs font-mono font-semibold text-text-primary">
                      #C1121F
                    </p>
                  </div>
                </div>
              </div>

              {/* Secondary & Tertiary */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-text-secondary">
                    Secundarios
                  </h4>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="h-16 rounded-lg mb-2 bg-secondary-light"></div>
                      <p className="text-xs font-mono text-text-primary">
                        #457B9D
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="h-16 rounded-lg mb-2 bg-secondary-main"></div>
                      <p className="text-xs font-mono text-text-primary">
                        #1D3557
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="h-16 rounded-lg mb-2 bg-secondary-dark"></div>
                      <p className="text-xs font-mono text-text-primary">
                        #0D1B2A
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-text-secondary">
                    Terciarios
                  </h4>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="h-16 rounded-lg mb-2 bg-tertiary-light"></div>
                      <p className="text-xs font-mono text-text-primary">
                        #4ECDC4
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="h-16 rounded-lg mb-2 bg-tertiary-main"></div>
                      <p className="text-xs font-mono text-text-primary">
                        #2A9D8F
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="h-16 rounded-lg mb-2 bg-tertiary-dark"></div>
                      <p className="text-xs font-mono text-text-primary">
                        #1B7367
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Colors */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-text-secondary">
                  Colores de Estado
                </h4>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    {
                      color: "bg-success-main",
                      label: "Success",
                      hex: "#06D6A0",
                    },
                    { color: "bg-error-main", label: "Error", hex: "#EF476F" },
                    {
                      color: "bg-warning-main",
                      label: "Warning",
                      hex: "#FFB703",
                    },
                    { color: "bg-info-main", label: "Info", hex: "#118AB2" },
                  ].map((status) => (
                    <div key={status.color}>
                      <div
                        className={`h-16 rounded-lg mb-2 ${status.color}`}
                      ></div>
                      <p className="text-xs font-semibold capitalize mb-1 text-text-primary">
                        {status.label}
                      </p>
                      <p className="text-xs font-mono text-text-secondary">
                        {status.hex}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guide */}
              <div className="mt-8 p-4 bg-info-bg rounded-lg border border-info-main/20">
                <h4 className="text-sm font-bold text-info-contrast mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Uso de clases Tailwind personalizadas
                </h4>
                <div className="text-xs text-info-contrast space-y-2">
                  <p>
                    <strong>Clases disponibles:</strong>
                  </p>
                  <code className="block bg-background-paper p-2 rounded mt-2 text-text-primary text-xs">
                    bg-primary-main text-success-main
                    <br />
                    bg-background-paper text-text-primary
                    <br />
                    border-background-contrast
                  </code>
                  <p className="mt-2">
                    <strong>Adaptación automática al tema:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-xs">
                    <li>bg-background-main cambia con dark mode</li>
                    <li>text-text-primary se ajusta automáticamente</li>
                    <li>Todas las variables responden al toggle</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TomaTaskMockup;
