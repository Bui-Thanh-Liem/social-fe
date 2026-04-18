import * as React from "react";
import {
  useWatch,
  type Control,
  type FieldErrors,
  type Path,
  type UseFormRegister,
} from "react-hook-form";

import { Eye, EyeOff } from "lucide-react";
import { cn } from "~/utils/cn.util";
import { getNestedError } from "~/utils/get-nested-error.util";
import { Label } from "./label";
import { CircularProgress } from "./circular-progress";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

type InputSize = "sm" | "md" | "lg";

type InputMainProps<T extends object> = React.ComponentProps<typeof Input> & {
  id: string;
  name: Path<T>;
  label?: string;
  placeholder: string;
  control: Control<T>;
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
  isMaxLength?: boolean;
  maxCountLength?: number;
  sizeInput?: InputSize;
  fullWidth?: boolean;
  className?: string;
};

const sizeStyles: Record<InputSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-3 text-base",
  lg: "h-12 px-3 text-lg",
};

function InputMain<T extends object>({
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
  type,
  className,
}: InputMainProps<T>) {
  const value = useWatch({ control, name }) ?? "";
  const errorMessage = getNestedError(errors, name)?.message;
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={cn(fullWidth && "w-full")}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          id={id}
          type={type === "password" && showPassword ? "text" : type}
          placeholder={placeholder}
          maxLength={maxCountLength}
          className={cn(
            "mt-2",
            sizeStyles[sizeInput],
            fullWidth && "w-full",
            errorMessage && "border-red-500 bg-red-50",
            type === "password" && "pr-10", // Add padding for eye icon
            className,
          )}
          {...register(name)}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        {isMaxLength && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <CircularProgress
              value={value.length || 0}
              max={maxCountLength}
              size={18}
              strokeWidth={2}
            />
          </div>
        )}
      </div>
      {errorMessage && (
        <p className="text-sm mt-1 text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}

export { Input, InputMain };
