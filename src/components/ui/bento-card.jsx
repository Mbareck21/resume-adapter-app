import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card"

const BentoCard = React.forwardRef(({ 
  className, 
  title,
  description,
  footer,
  highlight = false,
  hover = true,
  children,
  ...props 
}, ref) => {
  return (
    <Card
      ref={ref}
      className={cn(
        "bento-card overflow-hidden", 
        highlight && "border-primary/20 bg-card/50 backdrop-blur-sm",
        hover && "hover:shadow-card-hover transition-all duration-300",
        className
      )}
      {...props}
    >
      {(title || description) && (
        <CardHeader className="pb-4">
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      
      <CardContent className="p-0">
        {children}
      </CardContent>
      
      {footer && (
        <CardFooter className="pt-4 mt-auto">
          {footer}
        </CardFooter>
      )}
    </Card>
  )
})

BentoCard.displayName = "BentoCard"

const BentoGrid = React.forwardRef(({ 
  className,
  columns = 3,
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "grid gap-4 md:gap-6", 
        {
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-3": columns === 3,
          "grid-cols-1 md:grid-cols-2": columns === 2,
          "grid-cols-1": columns === 1,
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-4": columns === 4
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

BentoGrid.displayName = "BentoGrid"

export { BentoCard, BentoGrid } 