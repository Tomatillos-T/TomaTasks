import React from "react";
import type { InputHTMLAttributes } from 'react'; 

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, required, error, ...props }) => {
  const isNumberInput = props.type === "numbers";

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-text-primary mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        className={`rounded-lg border border-background-contrast bg-background-paper text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-main disabled:opacity-50 disabled:cursor-not-allowed
          ${isNumberInput ? "px-2 py-1 w-26" : "px-3 py-2 w-full"} 
          ${error ? "border-red-500" : ""}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default Input;
