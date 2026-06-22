import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  type?: "button" | "submit" | "reset";
  formAction?: string;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-mowsil-green text-white hover:brightness-105 active:scale-[0.98] shadow-sm",
  secondary:
    "border-2 border-mowsil-navy text-mowsil-navy bg-transparent hover:bg-mowsil-navy hover:text-white",
  ghost:
    "text-mowsil-navy bg-transparent hover:bg-mowsil-gray",
  danger:
    "bg-mowsil-error text-white hover:brightness-110",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-lg font-sans font-bold transition-all duration-200 ease-out cursor-pointer disabled:opacity-40 disabled:pointer-events-none no-underline";

export function Button({ className, variant = "primary", size = "md", disabled, href, children, ...props }: ButtonProps) {
  const classes = cn(baseClasses, variantStyles[variant], sizeStyles[size], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  );
}

export type { ButtonProps, ButtonVariant, ButtonSize };
