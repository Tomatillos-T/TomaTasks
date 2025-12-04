import { Plus } from "lucide-react";
import Button from "@/components/Button";

interface SelectWithCreateProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
  onCreateClick: () => void;
  required?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

export default function SelectWithCreate({
  label,
  name,
  value,
  onChange,
  options,
  onCreateClick,
  required = false,
  disabled = false,
  isLoading = false,
  placeholder = "-- Seleccione una opción --",
}: SelectWithCreateProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col">
        <label className="text-sm font-medium text-text-primary mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="px-3 py-2 rounded-lg border border-background-contrast bg-background-paper text-text-secondary flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-primary-main border-t-transparent rounded-full"></div>
          <span>Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-text-primary mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-2 items-stretch">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="flex-1 px-3 py-2 rounded-lg border border-background-contrast bg-background-paper text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-main disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Button
          type="button"
          variant="secondary"
          onClick={onCreateClick}
          disabled={disabled}
          className="flex-shrink-0"
          title={`Crear nuevo ${label.toLowerCase()}`}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
