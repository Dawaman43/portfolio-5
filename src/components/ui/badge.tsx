import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "outline" | "destructive";
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const styles =
    variant === "secondary"
      ? "bg-white/10 text-white border border-white/20"
      : variant === "outline"
      ? "bg-transparent text-white border border-white/25"
      : variant === "destructive"
      ? "bg-red-600 text-white"
      : "bg-white text-black";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        styles,
        className
      )}
      {...props}
    />
  );
}
