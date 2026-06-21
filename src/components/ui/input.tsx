"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-bold text-mowsil-navy">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-lg border px-3.5 py-2.5 text-sm text-mowsil-navy bg-white font-sans",
            "border-mowsil-card-border placeholder:text-mowsil-legend",
            "focus:outline-none focus:ring-2 focus:ring-mowsil-green/30 focus:border-mowsil-green",
            "transition-all duration-200",
            error && "border-mowsil-error focus:ring-mowsil-error/30 focus:border-mowsil-error",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-mowsil-error">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
