import React, { useEffect } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-overlay p-4">
      <div className="bg-background-paper rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-background-contrast flex-shrink-0">
          {title && <h3 className="text-lg font-semibold text-text-primary">{title}</h3>}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-background-subtle focus:outline-none focus:ring-2 focus:ring-primary-main"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && <div className="px-6 py-4 border-t border-background-contrast flex justify-end gap-3 flex-shrink-0">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
