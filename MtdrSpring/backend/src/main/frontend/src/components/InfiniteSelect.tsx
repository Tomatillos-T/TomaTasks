import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface InfiniteSelectProps<T> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  items: T[];
  getItemId: (item: T) => string;
  getItemLabel: (item: T) => string;
  isLoading: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export default function InfiniteSelect<T>({
  label,
  value,
  onChange,
  items,
  getItemId,
  getItemLabel,
  isLoading,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  placeholder = "Seleccione una opción",
  disabled = false,
}: InfiniteSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Update dropdown position when opened or on scroll/resize
  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom,
          left: rect.left,
          width: rect.width,
        });
      }
    };

    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Handle scroll to load more
  const handleScroll = () => {
    if (!listRef.current || !hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      fetchNextPage();
    }
  };

  const selectedItem = items.find((item) => getItemId(item) === value);
  const displayValue = selectedItem ? getItemLabel(selectedItem) : placeholder;

  // Render dropdown content
  const dropdownContent = isOpen && (
    <div
      ref={dropdownRef}
      className="fixed bg-background-paper border border-background-contrast rounded-lg shadow-lg max-h-60 overflow-hidden"
      style={{
        top: `${dropdownPosition.top + 4}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        zIndex: 9999,
      }}
    >
      <div
        ref={listRef}
        onScroll={handleScroll}
        className="max-h-60 overflow-y-auto"
      >
        {/* Empty option */}
        <div
          onClick={() => {
            onChange("");
            setIsOpen(false);
          }}
          className="px-3 py-2 hover:bg-background-contrast cursor-pointer text-text-secondary"
        >
          {placeholder}
        </div>

        {/* Items */}
        {items.map((item) => (
          <div
            key={getItemId(item)}
            onClick={() => {
              onChange(getItemId(item));
              setIsOpen(false);
            }}
            className={`px-3 py-2 hover:bg-background-contrast cursor-pointer ${
              getItemId(item) === value
                ? "bg-primary-main/10 text-primary-main"
                : "text-text-primary"
            }`}
          >
            {getItemLabel(item)}
          </div>
        ))}

        {/* Loading indicator */}
        {isFetchingNextPage && (
          <div className="px-3 py-2 text-center text-text-secondary flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Cargando más...
          </div>
        )}

        {/* No more items indicator */}
        {!hasNextPage && items.length > 0 && (
          <div className="px-3 py-2 text-center text-text-secondary text-sm">
            No hay más elementos
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-text-primary mb-1">
        {label}
      </label>

      {/* Select Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-3 py-2 rounded-lg border border-background-contrast bg-background-paper text-text-primary text-left focus:outline-none focus:ring-2 focus:ring-primary-main flex items-center justify-between ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <span className={!selectedItem ? "text-text-secondary" : ""}>
          {displayValue}
        </span>
        <div className="flex items-center gap-2">
          {isLoading && (
            <svg
              className="animate-spin h-4 w-4 text-text-secondary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          <svg
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown List using Portal */}
      {dropdownContent && createPortal(dropdownContent, document.body)}
    </div>
  );
}
