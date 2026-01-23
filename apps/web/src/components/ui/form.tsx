import * as React from "react";
import { useForm, Controller, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "../../lib/utils";
import { AlertCircle } from "lucide-react";

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
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
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
            "flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm",
            "placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 hover:border-gray-400",
          )}
          {...registerProps}
        />
      )}
      {error && (
        <p
          id={errorId}
          className="flex items-center gap-1 text-sm text-red-600"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}

export { FormField };
export type { FormFieldProps };
