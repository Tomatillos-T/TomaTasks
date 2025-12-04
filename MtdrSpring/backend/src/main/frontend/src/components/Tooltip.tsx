import React, { createContext, useContext, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface TooltipContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TooltipContext = createContext<TooltipContextType | null>(null);

const useTooltipContext = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error("Tooltip components must be used within Tooltip");
  }
  return context;
};

interface TooltipProps {
  children: ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </TooltipContext.Provider>
  );
};

interface TooltipTriggerProps extends HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  children: ReactNode;
}

export const TooltipTrigger: React.FC<TooltipTriggerProps> = ({
  asChild,
  children,
  ...props
}) => {
  const { setOpen } = useTooltipContext();

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as {
      onMouseEnter?: (e: React.MouseEvent) => void;
      onMouseLeave?: (e: React.MouseEvent) => void;
      onFocus?: (e: React.FocusEvent) => void;
      onBlur?: (e: React.FocusEvent) => void;
    };

    const cloneProps: React.HTMLAttributes<HTMLElement> = {
      ...props,
      onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
        setOpen(true);
        if (childProps.onMouseEnter) {
          childProps.onMouseEnter(e);
        }
      },
      onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
        setOpen(false);
        if (childProps.onMouseLeave) {
          childProps.onMouseLeave(e);
        }
      },
      onFocus: (e: React.FocusEvent<HTMLElement>) => {
        setOpen(true);
        if (childProps.onFocus) {
          childProps.onFocus(e);
        }
      },
      onBlur: (e: React.FocusEvent<HTMLElement>) => {
        setOpen(false);
        if (childProps.onBlur) {
          childProps.onBlur(e);
        }
      },
    };

    return React.cloneElement(children, cloneProps);
  }

  return (
    <button
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      {...props}
    >
      {children}
    </button>
  );
};

interface TooltipContentProps extends HTMLAttributes<HTMLDivElement> {
  side?: "top" | "bottom" | "left" | "right";
}

export const TooltipContent: React.FC<TooltipContentProps> = ({
  side = "top",
  className = "",
  children,
  ...props
}) => {
  const { open } = useTooltipContext();

  if (!open) return null;

  const sideStyles = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  return (
    <div
      className={clsx(
        "absolute z-50 overflow-hidden rounded-md bg-secondary-main px-3 py-1.5 text-xs text-secondary-contrast shadow-md animate-in fade-in-0 zoom-in-95",
        sideStyles[side],
        className
      )}
      role="tooltip"
      {...props}
    >
      {children}
    </div>
  );
};
