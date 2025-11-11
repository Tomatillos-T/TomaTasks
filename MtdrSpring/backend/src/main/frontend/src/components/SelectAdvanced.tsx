import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const SelectContext = createContext<SelectContextType | null>(null);

const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within Select");
  }
  return context;
};

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
}

export const SelectRoot: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, triggerRef }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

type SelectTriggerProps = HTMLAttributes<HTMLButtonElement>;

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  className = "",
  children,
  ...props
}) => {
  const { open, setOpen, triggerRef } = useSelectContext();

  return (
    <button
      ref={triggerRef}
      type="button"
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
      className={clsx(
        "flex h-10 w-full items-center justify-between rounded-lg border border-background-contrast bg-background-paper px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-main disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={clsx("ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform", {
          "transform rotate-180": open,
        })}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};

interface SelectValueProps {
  placeholder?: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  const { value } = useSelectContext();
  return <span>{value || placeholder}</span>;
};

interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {
  side?: "top" | "bottom";
}

export const SelectContent: React.FC<SelectContentProps> = ({
  side = "bottom",
  className = "",
  children,
  ...props
}) => {
  const { open, setOpen, triggerRef } = useSelectContext();
  const contentRef = useRef<HTMLDivElement>(null);

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

  const sideStyles = {
    top: "bottom-full mb-1",
    bottom: "top-full mt-1",
  };

  return (
    <div
      ref={contentRef}
      role="listbox"
      className={clsx(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-background-contrast bg-background-paper text-text-primary shadow-md animate-in fade-in-0 zoom-in-95",
        sideStyles[side],
        "w-full",
        className
      )}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  );
};

interface SelectItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const SelectItem: React.FC<SelectItemProps> = ({
  value: itemValue,
  className = "",
  children,
  ...props
}) => {
  const { value, onValueChange, setOpen } = useSelectContext();
  const isSelected = value === itemValue;

  return (
    <div
      role="option"
      aria-selected={isSelected}
      className={clsx(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-background-subtle focus:bg-background-subtle data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        isSelected && "bg-background-subtle",
        className
      )}
      onClick={() => {
        onValueChange(itemValue);
        setOpen(false);
      }}
      {...props}
    >
      {children}
      {isSelected && (
        <span className="ml-auto flex h-4 w-4 items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </div>
  );
};
