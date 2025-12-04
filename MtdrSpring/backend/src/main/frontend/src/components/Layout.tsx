import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Chatbot from "@/components/Chatbot";

// Map paths to sidebar tab IDs
const pathToTabMap: Record<string, string> = {
  "/dashboard": "dashboard",
  "/kpi-reports": "kpi-reports",
  "/tareas": "tasks",
  "/kanban": "kanban",
  "/equipos": "teams",
  "/proyectos": "projects",
  "/usuarios": "users",
  "/configuracion": "settings",
};

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Determine active tab based on current pathname
  const getActiveTabFromPath = (pathname: string): string => {
    // Check for exact match first
    if (pathToTabMap[pathname]) {
      return pathToTabMap[pathname];
    }

    // Check if pathname starts with any of the mapped paths (for nested routes like /equipos/:id)
    for (const [path, tabId] of Object.entries(pathToTabMap)) {
      if (pathname.startsWith(path)) {
        return tabId;
      }
    }

    // Default to dashboard
    return "dashboard";
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath(location.pathname));

  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath(location.pathname));
  }, [location.pathname]);

  return (
    <div className="h-screen flex flex-col bg-background-main overflow-hidden">
      {/* Fixed Navbar */}
      <Navbar />

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1 relative bg-background-subtle overflow-hidden min-h-0">
          <Outlet />
        </div>
      </div>

      {/* Chatbot Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl
                       w-full h-full sm:w-[95%] sm:h-[85%]
                       md:w-[85%] md:h-[80%]
                       lg:w-[75%] xl:w-[70%]
                       max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Modal Header with Close Button */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-100">
                Repository Assistant
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-200 text-xl font-bold transition"
              >
                ✖
              </button>
            </div>

            {/* Chatbot */}
            <div className="flex-1 overflow-hidden p-4">
              <Chatbot />
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-primary-main text-white px-4 py-3 rounded-full shadow-lg hover:bg-primary-dark z-50 transition-transform hover:scale-105"
        >
          💬
        </button>
      )}
    </div>
  );
}
