import React, { useEffect } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onOpenChange,
  children,
}) => {
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

type AlertDialogContentProps = HTMLAttributes<HTMLDivElement>;

export const AlertDialogContent: React.FC<AlertDialogContentProps> = ({
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
      role="alertdialog"
      aria-modal="true"
      {...props}
    >
      {children}
    </div>
  );
};

type AlertDialogHeaderProps = HTMLAttributes<HTMLDivElement>;

export const AlertDialogHeader: React.FC<AlertDialogHeaderProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col space-y-2 text-center sm:text-left mb-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

type AlertDialogTitleProps = HTMLAttributes<HTMLHeadingElement>;

export const AlertDialogTitle: React.FC<AlertDialogTitleProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <h2
      className={clsx(
        "text-lg font-semibold leading-none tracking-tight text-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
};

type AlertDialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const AlertDialogDescription: React.FC<AlertDialogDescriptionProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <p className={clsx("text-sm text-text-secondary", className)} {...props}>
      {children}
    </p>
  );
};

type AlertDialogFooterProps = HTMLAttributes<HTMLDivElement>;

export const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface AlertDialogActionProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive";
}

export const AlertDialogAction: React.FC<AlertDialogActionProps> = ({
  className = "",
  variant = "destructive",
  children,
  ...props
}) => {
  const variantStyles = {
    default: "bg-primary-main text-primary-contrast hover:bg-primary-main/90",
    destructive: "bg-error-bg text-error-contrast hover:bg-error-bg/90",
  };

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

type AlertDialogCancelProps = HTMLAttributes<HTMLButtonElement>;

export const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-md border border-background-contrast bg-transparent px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-background-subtle focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
