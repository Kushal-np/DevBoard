

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "tertiary" | "destructive";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium select-none " +
  "rounded transition-[transform,background-color,border-color,color,opacity] " +
  "duration-micro ease-[var(--ease)] active:scale-[0.98] " +
  "disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none";

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-base",
};

const variants: Record<Variant, string> = {
  primary:
  "bg-primary text-on-primary hover:bg-primary-hover" +
    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  secondary:
    "bg-transparent text-text border border-border-strong hover:bg-surface " +
    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  tertiary:
    "bg-transparent text-text-secondary hover:text-text hover:bg-surface " +
    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  destructive:
    "bg-transparent text-danger border border-danger/30 hover:bg-danger/10 " +
    "focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 focus-visible:ring-offset-background",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        {...props}
      >
        {loading && <Loader2 size={16} className="animate-spin" aria-hidden />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;