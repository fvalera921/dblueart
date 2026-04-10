import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-2xl border border-sky/20 bg-night/80 px-4 py-3 text-sm text-mist outline-none transition placeholder:text-mist/40 focus:border-sky/60",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
