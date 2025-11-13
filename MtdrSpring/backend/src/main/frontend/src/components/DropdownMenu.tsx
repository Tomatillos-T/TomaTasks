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

interface DropdownMenuContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const DropdownMenuContext = createContext<DropdownMenuContextType | null>(null);

const useDropdownMenuContext = () => {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenu components must be used within DropdownMenu");
  }
  return context;
};

interface DropdownMenuProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

interface DropdownMenuTriggerProps extends HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  children: ReactNode;
}

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  asChild,
  children,
  ...props
}) => {
  const { setOpen, open, triggerRef } = useDropdownMenuContext();

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as {
      onClick?: (e: React.MouseEvent) => void;
    };

    const cloneProps: React.HTMLAttributes<HTMLElement> & {
      ref: React.RefObject<HTMLElement | null>;
    } = {
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

interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
}

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  align = "end",
  className = "",
  children,
  ...props
}) => {
  const { open, setOpen, triggerRef } = useDropdownMenuContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      if (!triggerRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const top = triggerRect.bottom + 8;
      let left = 0;

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

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, align, triggerRef]);

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
        "fixed z-50 min-w-[8rem] overflow-hidden rounded-md border border-background-contrast bg-background-paper p-1 text-text-primary shadow-md animate-in fade-in-0 zoom-in-95",
        className
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      role="menu"
      {...props}
    >
      {children}
    </div>
  );

  return createPortal(content, document.body);
};

interface DropdownMenuItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  onSelect?: (event: Event) => void;
}

interface DropdownMenuItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  onSelect?: (event: Event) => void;
  disabled?: boolean;
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  className = "",
  children,
  onSelect,
  disabled = false,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (onSelect) {
      const event = new Event("select", { bubbles: true });
      onSelect(event);
    }
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <div
      className={clsx(
        "relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:bg-background-subtle focus:bg-background-subtle",
        className
      )}
      role="menuitem"
      aria-disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
};

type DropdownMenuLabelProps = HTMLAttributes<HTMLDivElement>;

export const DropdownMenuLabel: React.FC<DropdownMenuLabelProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <div
      className={clsx("px-2 py-1.5 text-sm font-semibold text-text-primary", className)}
      {...props}
    >
      {children}
    </div>
  );
};

type DropdownMenuSeparatorProps = HTMLAttributes<HTMLDivElement>;

export const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({
  className = "",
  ...props
}) => {
  return (
    <div
      className={clsx("-mx-1 my-1 h-px bg-background-contrast", className)}
      role="separator"
      {...props}
    />
  );
};
