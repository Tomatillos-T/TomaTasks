import React from "react";
import type { TextareaHTMLAttributes } from 'react'; 

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  error?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, required, error, ...props }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-text-primary mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        className={`px-3 py-2 rounded-lg border border-background-contrast bg-background-paper text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-main disabled:opacity-50 disabled:cursor-not-allowed resize-none ${
          error ? "border-red-500" : ""
        }`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default Textarea;
