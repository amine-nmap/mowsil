import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type TextareaProps = {
  label?: string;
  error?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="block text-sm font-semibold text-mowsil-navy">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-lg border border-mowsil-card-border bg-white px-3 py-2.5 text-sm text-mowsil-navy",
            "focus:outline-none focus:ring-2 focus:ring-mowsil-green/40 focus:border-mowsil-green",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "resize-y min-h-[80px]",
            error && "border-mowsil-error focus:ring-red-400",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-mowsil-error">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea, type TextareaProps };
