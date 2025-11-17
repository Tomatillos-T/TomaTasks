import React from "react";
import type { HTMLAttributes } from "react";
import clsx from "clsx";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "tertiary" | "outline" | "success" | "error" | "warning" | "todo" | "pending" | "inprogress" | "testing" | "done";
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
    secondary: "bg-secondary-main/10 text-secondary-dark border border-secondary-main/20",
    tertiary: "bg-tertiary-main/10 text-tertiary-dark border border-tertiary-main/20",
    outline: "text-text-primary border border-background-contrast bg-transparent",
    success: "bg-success-bg text-success-contrast border-transparent",
    error: "bg-error-bg text-error-contrast border-transparent",
    warning: "bg-warning-bg text-warning-contrast border-transparent",
    todo: "bg-status-todo-bg text-status-todo-contrast border-transparent",
    pending: "bg-status-pending-bg text-status-pending-contrast border-transparent",
    inprogress: "bg-status-inprogress-bg text-status-inprogress-contrast border-transparent",
    testing: "bg-status-testing-bg text-status-testing-contrast border-transparent",
    done: "bg-status-done-bg text-status-done-contrast border-transparent",
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
