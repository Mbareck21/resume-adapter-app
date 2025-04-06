import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const pillButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-button hover:brightness-110",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        accent:
          "bg-accent text-accent-foreground hover:brightness-110",
        outline:
          "border border-border bg-background hover:bg-secondary hover:text-secondary-foreground",
        ghost:
          "hover:bg-secondary hover:text-secondary-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:brightness-110",
      },
      size: {
        default: "h-10 px-6 py-2.5",
        sm: "h-8 px-4 py-2",
        lg: "h-12 px-8 py-3",
        icon: "h-10 w-10 p-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const PillButton = React.forwardRef(({ 
  className, 
  variant, 
  size, 
  asChild = false, 
  children,
  ...props 
}, ref) => {
  const Comp = asChild ? Slot : "button"
  
  return (
    <Comp
      ref={ref}
      className={cn(pillButtonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Comp>
  )
})

PillButton.displayName = "PillButton"

export { PillButton, pillButtonVariants } 