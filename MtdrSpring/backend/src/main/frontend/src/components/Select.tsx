import React from "react";
import type { SelectHTMLAttributes } from 'react'; 

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  required?: boolean;
  error?: string;
  options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({ label, required, error, options, ...props }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-text-primary mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        className={`px-3 py-2 rounded-lg border border-background-contrast bg-background-paper text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-main disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? "border-red-500" : ""
        }`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default Select;
