import React from "react";
import type { HTMLAttributes } from "react";
import clsx from "clsx";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "error" | "warning";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 max-w-full";

  const variantStyles = {
    default: "bg-primary-main text-primary-contrast border-transparent",
    secondary: "bg-background-subtle text-text-primary border-transparent",
    outline: "text-text-primary border border-background-contrast bg-transparent",
    success: "bg-success-bg text-success-contrast border-transparent",
    error: "bg-error-bg text-error-contrast border-transparent",
    warning: "bg-warning-bg text-warning-contrast border-transparent",
  };

  // Extract text content for title attribute
  const textContent = typeof children === 'string' ? children : '';

  return (
    <div
      className={clsx(baseStyles, variantStyles[variant], className)}
      title={textContent}
      {...props}
    >
      <span className="truncate">{children}</span>
    </div>
  );
};

export default Badge;
