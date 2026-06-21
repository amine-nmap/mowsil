"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Info, LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type MessageVariant = "success" | "error" | "info";

interface MessageProps {
  variant?: MessageVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

const icons: Record<MessageVariant, LucideIcon> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const variantStyles: Record<MessageVariant, string> = {
  success: "bg-mowsil-success-bg text-mowsil-navy border border-mowsil-green/20",
  error: "bg-red-50 text-mowsil-error border border-red-200",
  info: "bg-mowsil-gray text-mowsil-navy border border-mowsil-card-border",
};

function Message({ variant = "info", title, children, className }: MessageProps) {
  const Icon = icons[variant];
  return (
    <div className={cn("flex items-start gap-3 rounded-lg p-4", variantStyles[variant], className)}>
      <Icon size={20} className="mt-0.5 shrink-0" />
      <div className="space-y-1">
        {title && <p className="font-bold text-sm">{title}</p>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export { Message, type MessageVariant };
