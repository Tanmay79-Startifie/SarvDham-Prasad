import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-xl text-elderly-base font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-saffron text-primary-foreground hover:shadow-divine hover:scale-105 active:scale-95",
        divine: "bg-gradient-divine text-primary-foreground hover:shadow-divine hover:scale-105 active:scale-95 shadow-golden",
        golden: "bg-gradient-golden text-accent hover:shadow-golden hover:scale-105 active:scale-95",
        sacred: "bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-soft hover:scale-105 active:scale-95",
        outline: "border-2 border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-divine hover:scale-105 active:scale-95",
        ghost: "text-primary hover:bg-primary/10 hover:scale-105 active:scale-95",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105 active:scale-95",
      },
      size: {
        default: "h-14 px-8 py-4 text-elderly-base",
        sm: "h-12 px-6 py-3 text-elderly-sm",
        lg: "h-16 px-12 py-5 text-elderly-lg",
        xl: "h-20 px-16 py-6 text-elderly-xl",
        icon: "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
