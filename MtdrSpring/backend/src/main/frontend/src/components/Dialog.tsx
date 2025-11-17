import React, { useEffect } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in"
        onClick={() => onOpenChange(false)}
      />
      {/* Content container */}
      <div className="relative z-50">{children}</div>
    </div>
  );
};

type DialogContentProps = HTMLAttributes<HTMLDivElement>;

export const DialogContent: React.FC<DialogContentProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "relative bg-background-paper rounded-lg shadow-lg border border-background-contrast p-6 w-full max-w-lg mx-auto animate-in fade-in zoom-in-95",
        className
      )}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      {...props}
    >
      {children}
    </div>
  );
};

type DialogHeaderProps = HTMLAttributes<HTMLDivElement>;

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <div
      className={clsx("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

type DialogTitleProps = HTMLAttributes<HTMLHeadingElement>;

export const DialogTitle: React.FC<DialogTitleProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <h2
      className={clsx("text-lg font-semibold leading-none tracking-tight text-text-primary", className)}
      {...props}
    >
      {children}
    </h2>
  );
};

type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const DialogDescription: React.FC<DialogDescriptionProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <p
      className={clsx("text-sm text-text-secondary", className)}
      {...props}
    >
      {children}
    </p>
  );
};
