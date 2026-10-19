import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all",
        "disabled:opacity-40 disabled:cursor-not-allowed rounded-lg",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
        {
          "bg-black text-white hover:bg-neutral-800 active:scale-[0.98]":
            variant === "primary",
          "bg-white text-black border border-neutral-300 hover:bg-neutral-50":
            variant === "secondary",
          "bg-transparent text-black hover:bg-neutral-100":
            variant === "ghost",
          "h-9 px-4 text-sm": size === "sm",
          "h-11 px-6 text-sm": size === "md",
          "h-14 px-8 text-base": size === "lg",
        },
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";