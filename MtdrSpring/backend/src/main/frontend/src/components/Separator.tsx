import React from "react";
import type { HTMLAttributes } from "react";
import clsx from "clsx";

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

export const Separator: React.FC<SeparatorProps> = ({
  orientation = "horizontal",
  decorative = true,
  className = "",
  ...props
}) => {
  const orientationStyles =
    orientation === "vertical"
      ? "h-full w-[1px]"
      : "h-[1px] w-full";

  return (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={clsx("shrink-0 bg-background-contrast", orientationStyles, className)}
      {...props}
    />
  );
};

export default Separator;
