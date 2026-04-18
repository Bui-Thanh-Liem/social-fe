import * as React from "react";
import { useWatch } from "react-hook-form";

import {
  type Control,
  type FieldErrors,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { cn } from "~/utils/cn.util";
import { getNestedError } from "~/utils/get-nested-error.util";
import { Label } from "./label";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

interface TextareaMainProps<T extends object> {
  id: string;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  control: Control<T>;
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
  isMaxLength?: boolean;
  maxCountLength?: number;
  sizeInput?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}

// Size styles for textarea
const sizeStyles = {
  sm: "text-sm py-1 px-2",
  md: "text-base py-2 px-3",
  lg: "text-lg py-3 px-4",
};

function TextareaMain<T extends object>({
  id,
  name,
  label,
  placeholder,
  control,
  errors,
  register,
  isMaxLength,
  maxCountLength = 500,
  sizeInput = "md",
  fullWidth,
  className,
}: TextareaMainProps<T>) {
  const value = useWatch({ control, name }) ?? "";
  const errorMessage = getNestedError(errors, name)?.message;

  return (
    <div className={cn(fullWidth && "w-full")}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <div className="relative">
        <Textarea
          id={id}
          placeholder={placeholder}
          maxLength={maxCountLength}
          className={cn(
            "mt-2",
            sizeStyles[sizeInput],
            fullWidth && "w-full",
            errorMessage && "border-red-500 bg-red-50",
            className,
          )}
          {...register(name)}
        />
        {isMaxLength && (
          <div className="absolute right-0 -bottom-6">
            <p className="text-right text-sm text-muted-foreground">
              {value.length}/{maxCountLength}
            </p>
          </div>
        )}
      </div>
      {errorMessage && (
        <p className="text-sm mt-1 text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}

export { TextareaMain };

export { Textarea };
