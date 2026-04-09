import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Check, CircleIcon } from "lucide-react";

import { cn } from "~/utils/cn.util";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-all outline-none",
        "focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        // ✅ Khi checked thì border đổi sang sky-400
        "data-[state=checked]:border-sky-500 data-[state=checked]:text-sky-400",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        {/* ✅ Fill của chấm tròn bên trong cũng đổi sang sky-400 */}
        <CircleIcon className="fill-sky-400 absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

function RadioGroupItemMain({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item-main"
      className={cn(
        // base shape
        "relative flex items-center justify-center rounded-full border transition-all cursor-pointer",
        "size-5 border-gray-300 hover:border-sky-400 focus-visible:ring-2 focus-visible:ring-sky-400",
        // checked
        "data-[state=checked]:bg-sky-400 data-[state=checked]:border-blue-400",
        // disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator asChild>
        <Check className="size-4 text-white" strokeWidth={3} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem, RadioGroupItemMain };
