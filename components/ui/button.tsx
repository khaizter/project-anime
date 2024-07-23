import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-medium-red-violet/60 text-primary-foreground hover:bg-lavender-magenta font-space-grotesk",
        destructive:
          "bg-red-ribbon text-destructive-foreground hover:bg-red-ribbon/60 font-space-grotesk",
        outline:
          "text-medium-red-violet border border-transparent bg-transparent hover:bg-transparent hover:text-white/60 font-space-grotesk",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 font-space-grotesk",
        ghost: "hover:bg-transparent hover:text-white/60 font-space-grotesk",
        link: "text-primary underline-offset-4 hover:underline font-space-grotesk",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
