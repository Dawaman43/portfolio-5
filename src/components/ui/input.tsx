import * as React from "react";
import { cn } from "@/lib/utils";

// Branded to avoid lint rule about trivially equivalent interfaces
export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  __inputBrand?: never;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "h-10 w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:border-white/40",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
