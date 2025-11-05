import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface PopoverContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const PopoverContext = createContext<PopoverContextType | null>(null);

const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error("Popover components must be used within Popover");
  }
  return context;
};

interface PopoverProps {
  children: ReactNode;
}

export const Popover: React.FC<PopoverProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
};

interface PopoverTriggerProps extends HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  children: ReactNode;
}

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({
  asChild,
  children,
  ...props
}) => {
  const { setOpen, open, triggerRef } = usePopoverContext();

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as {
      onClick?: (e: React.MouseEvent) => void;
    };

    const cloneProps: React.HTMLAttributes<HTMLElement> & { ref: React.RefObject<HTMLElement | null> } = {
      ...props,
      ref: triggerRef,
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        setOpen(!open);
        if (childProps.onClick) {
          childProps.onClick(e);
        }
      },
    };

    return React.cloneElement(children, cloneProps);
  }

  return (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
    </button>
  );
};

interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
}

export const PopoverContent: React.FC<PopoverContentProps> = ({
  align = "center",
  side = "bottom",
  className = "",
  children,
  ...props
}) => {
  const { open, setOpen, triggerRef } = usePopoverContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      if (!triggerRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;

      // Calculate vertical position
      if (side === "bottom") {
        top = triggerRect.bottom + 8;
      } else if (side === "top") {
        top = triggerRect.top - 8;
        if (contentRef.current) {
          top -= contentRef.current.offsetHeight;
        }
      } else if (side === "left") {
        top = triggerRect.top;
        left = triggerRect.left - 8;
        if (contentRef.current) {
          left -= contentRef.current.offsetWidth;
        }
      } else if (side === "right") {
        top = triggerRect.top;
        left = triggerRect.right + 8;
      }

      // Calculate horizontal position for top/bottom sides
      if (side === "top" || side === "bottom") {
        if (align === "start") {
          left = triggerRect.left;
        } else if (align === "end") {
          left = triggerRect.right;
          if (contentRef.current) {
            left -= contentRef.current.offsetWidth;
          }
        } else {
          left = triggerRect.left + triggerRect.width / 2;
          if (contentRef.current) {
            left -= contentRef.current.offsetWidth / 2;
          }
        }
      }

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, side, align, triggerRef]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, setOpen, triggerRef]);

  if (!open) return null;

  const content = (
    <div
      ref={contentRef}
      className={clsx(
        "fixed z-50 rounded-md border border-background-contrast bg-background-paper text-text-primary shadow-md outline-none animate-in fade-in-0 zoom-in-95",
        className
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      role="dialog"
      aria-modal="true"
      {...props}
    >
      {children}
    </div>
  );

  return createPortal(content, document.body);
};
