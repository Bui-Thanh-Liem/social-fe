import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { Loader2 } from "lucide-react";
import { cn } from "~/utils/cn.util";

type ButtonSize = "sm" | "md" | "lg";

type ButtonMainProps = React.ComponentProps<typeof Button> & {
  fullWidth?: boolean;
  size?: ButtonSize;
  loading?: boolean;
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-base",
  lg: "h-13 px-6 text-lg",
};

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-red-400 cursor-pointer text-white rounded-full shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-[#D9D9D9] cursor-pointer bg-transparent text-black hover:bg-gray-100 rounded-full",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // size: {
      //   default: "h-9 px-4 py-2 has-[>svg]:px-3",
      //   sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
      //   lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
      //   icon: "size-9",
      // },
    },
    defaultVariants: {
      variant: "default",
      // size: "default",
    },
  },
);

function Button({
  className,
  variant,
  // size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  );
}

function ButtonMain({
  className,
  fullWidth,
  size = "md",
  variant,
  loading,
  children,
  ...props
}: ButtonMainProps) {
  const classes = variant
    ? ""
    : "bg-black hover:bg-[#333] text-white rounded-full shadow  cursor-pointer";

  return (
    <Button
      variant={variant}
      className={cn(
        classes,
        sizeStyles[size],
        fullWidth && "w-full",
        className,
      )}
      disabled={loading}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin size-4" /> : children}
    </Button>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Button, ButtonMain, buttonVariants };
