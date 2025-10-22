import React, { createContext, useContext, useState } from "react";
import type { HTMLAttributes, InputHTMLAttributes } from "react";
import clsx from "clsx";

interface CommandContextType {
  search: string;
  setSearch: (search: string) => void;
  shouldFilter: boolean;
}

const CommandContext = createContext<CommandContextType | null>(null);

const useCommandContext = () => {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error("Command components must be used within Command");
  }
  return context;
};

interface CommandProps extends HTMLAttributes<HTMLDivElement> {
  shouldFilter?: boolean;
}

export const Command: React.FC<CommandProps> = ({
  shouldFilter = true,
  className = "",
  children,
  ...props
}) => {
  const [search, setSearch] = useState("");

  return (
    <CommandContext.Provider value={{ search, setSearch, shouldFilter }}>
      <div
        className={clsx(
          "flex flex-col overflow-hidden rounded-md bg-background-paper text-text-primary",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </CommandContext.Provider>
  );
};

interface CommandInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChangeCapture?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CommandInput: React.FC<CommandInputProps> = ({
  className = "",
  placeholder,
  value: externalValue,
  onChangeCapture,
  ...props
}) => {
  const { search, setSearch } = useCommandContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (onChangeCapture) {
      onChangeCapture(e);
    }
  };

  return (
    <div className="flex items-center border-b border-background-contrast px-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2 h-4 w-4 shrink-0 opacity-50"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        className={clsx(
          "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-text-secondary disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        placeholder={placeholder}
        value={externalValue !== undefined ? externalValue : search}
        onChange={handleChange}
        {...props}
      />
    </div>
  );
};

type CommandListProps = HTMLAttributes<HTMLDivElement>;

export const CommandList: React.FC<CommandListProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "max-h-[300px] overflow-y-auto overflow-x-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

type CommandEmptyProps = HTMLAttributes<HTMLDivElement>;

export const CommandEmpty: React.FC<CommandEmptyProps> = ({
  className = "",
  children,
  ...props
}) => {
  const { search } = useCommandContext();

  if (!search) return null;

  return (
    <div
      className={clsx(
        "py-6 text-center text-sm text-text-secondary",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface CommandGroupProps extends HTMLAttributes<HTMLDivElement> {
  heading?: string;
}

export const CommandGroup: React.FC<CommandGroupProps> = ({
  heading,
  className = "",
  children,
  ...props
}) => {
  return (
    <div
      className={clsx("overflow-hidden p-1 text-text-primary", className)}
      {...props}
    >
      {heading && (
        <div className="px-2 py-1.5 text-xs font-medium text-text-secondary">
          {heading}
        </div>
      )}
      {children}
    </div>
  );
};

interface CommandItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  onSelect?: (value: string) => void;
  value?: string;
  disabled?: boolean;
}

export const CommandItem: React.FC<CommandItemProps> = ({
  className = "",
  onSelect,
  value = "",
  disabled = false,
  children,
  ...props
}) => {
  const { search, shouldFilter } = useCommandContext();

  const handleClick = () => {
    if (!disabled && onSelect) {
      onSelect(value);
    }
  };

  // Simple filtering logic
  const shouldShow =
    !shouldFilter ||
    !search ||
    (typeof children === "string" &&
      children.toLowerCase().includes(search.toLowerCase())) ||
    value.toLowerCase().includes(search.toLowerCase());

  if (!shouldShow) return null;

  return (
    <div
      className={clsx(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-background-subtle focus:bg-background-subtle data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        className
      )}
      onClick={handleClick}
      data-disabled={disabled}
      role="option"
      aria-selected="false"
      {...props}
    >
      {children}
    </div>
  );
};

type CommandSeparatorProps = HTMLAttributes<HTMLDivElement>;

export const CommandSeparator: React.FC<CommandSeparatorProps> = ({
  className = "",
  ...props
}) => {
  return (
    <div
      className={clsx("-mx-1 h-px bg-background-contrast", className)}
      {...props}
    />
  );
};
