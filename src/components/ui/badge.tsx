"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-mowsil-navy text-white",
  success: "bg-mowsil-green text-white",
  warning: "bg-amber-400 text-white",
  error: "bg-mowsil-error text-white",
  outline: "border border-mowsil-navy text-mowsil-navy bg-transparent",
};

function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md font-bold uppercase tracking-wider text-[11px] px-2 py-0.5 leading-normal",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge, type BadgeVariant };
