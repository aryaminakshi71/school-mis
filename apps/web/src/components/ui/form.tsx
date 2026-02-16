import { AlertCircle } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";

interface FormFieldProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  error?: string;
  control?: React.ReactElement;
  registerProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

function FormField({
  name,
  label,
  required,
  placeholder,
  type = "text",
  error,
  control,
  registerProps,
}: FormFieldProps) {
  const id = `form-${name}`;
  const errorId = `form-${name}-error`;

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block font-medium text-foreground text-sm">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {control ? (
        <div id={id}>{control}</div>
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "flex h-10 w-full rounded-lg border bg-card px-3 py-2 text-sm",
            "placeholder:text-muted-foreground",
            "focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring",
            "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50",
            error
              ? "border-destructive/30 focus:ring-destructive/50"
              : "border-border hover:border-border",
          )}
          {...registerProps}
        />
      )}
      {error && (
        <p
          id={errorId}
          className="flex items-center gap-1 text-destructive text-sm"
        >
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}

export { FormField };
export type { FormFieldProps };
