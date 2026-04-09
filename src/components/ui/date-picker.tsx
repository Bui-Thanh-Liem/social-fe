import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import {
  useWatch,
  type Control,
  type FieldErrors,
  type Path,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { cn } from "~/utils/cn.util";
import { formatDateToDateVN } from "~/utils/date-time";
import { getNestedError } from "~/utils/get-nested-error";
import { Button } from "./button";
import { Calendar } from "./calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Input } from "./input";
import { Label } from "./label";

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

type InputSize = "sm" | "md" | "lg";

type DatePickerProps<T extends object> = React.ComponentProps<typeof Input> & {
  id: string;
  name: Path<T>;
  label?: string;
  placeholder: string;
  control: Control<T>;
  fullWidth?: boolean;
  className?: string;
  sizeInput?: InputSize;
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
};

const sizeStyles: Record<InputSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-base",
  lg: "h-12 px-6 text-lg",
};

export function DatePicker<T extends object>({
  id,
  name,
  label,
  placeholder,
  control,
  errors,
  register,
  sizeInput = "md",
  fullWidth,
  className,
  setValue,
}: DatePickerProps<T>) {
  const [open, setOpen] = useState(false);
  const value = useWatch({ control, name }) ?? "";
  const valueDate = new Date(value);
  const errorMessage = getNestedError(errors, name)?.message;

  return (
    <DropdownMenu>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          readOnly
          id={id}
          value={formatDateToDateVN(valueDate)}
          placeholder={placeholder}
          className={cn(
            "mt-2",
            sizeStyles[sizeInput],
            fullWidth && "w-full",
            errorMessage && "border-red-500 bg-red-50",
            className,
          )}
        />
        <DropdownMenuTrigger asChild>
          <Button
            id={id}
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            <CalendarIcon className="size-3.5" onClick={() => setOpen(!open)} />
          </Button>
        </DropdownMenuTrigger>
      </div>

      <DropdownMenuContent className="p-0 border-0">
        <Calendar
          mode="single"
          selected={valueDate}
          captionLayout="dropdown"
          month={valueDate}
          onMonthChange={(date) => {
            if (date && isValidDate(date)) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setValue(name, date as any, {
                shouldValidate: true,
              });
            }
          }}
          onSelect={(date) => {
            if (date && isValidDate(date)) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setValue(name, date as any, {
                shouldValidate: true,
              });
            }
          }}
          {...register(name)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
