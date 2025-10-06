import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Chatbot from "./Chatbot";

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-background-main">
      {/* Navbar fija en la parte superior */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar lateral */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Contenedor principal de contenido */}
        <div className="flex-1 relative p-6 bg-background-subtle overflow-y-auto">
          {/* Aquí se renderizan las rutas hijas */}
          <Outlet />
        </div>
      </div>

      {/* Modal flotante del chatbot */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div
            className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl 
              w-full h-full sm:w-[90%] sm:h-[80%] 
              md:w-[70%] md:h-[75%] 
              lg:w-[60%] xl:w-[40%] 
              max-h-[90vh] overflow-hidden p-4"
          >
            <Chatbot />
          </div>
        </div>
      )}

      {/* Botón flotante para abrir/cerrar chatbot */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-primary-main text-white px-4 py-3 rounded-full shadow-lg hover:bg-primary-dark z-50 transition-transform hover:scale-105"
      >
        {open ? "✖" : "💬"}
      </button>
    </div>
  );
}
