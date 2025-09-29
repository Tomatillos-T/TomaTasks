// Layout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import { useState } from "react";
import Chatbot from "./chatbot";

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Sidebar />
      <div className="relative">
        {/* Modal flotante */}
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <div
              className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl 
                            w-full h-full sm:w-[90%] sm:h-[80%] 
                            md:w-[70%] md:h-[75%] 
                            lg:w-[60%] 
                            xl:w-[40%] 
                            max-h-[90vh] overflow-hidden p-4"
            >
              <Chatbot />
            </div>
          </div>
        )}

        <Outlet />

        {/* Botón flotante */}
        <button
          onClick={() => setOpen(!open)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 z-50"
        >
          {open ? "✖" : "💬"}
        </button>
      </div>
    </>
  );
}
