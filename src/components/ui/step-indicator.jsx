import * as React from "react"
import { cn } from "@/lib/utils"

const StepIndicator = React.forwardRef(({ 
  className,
  steps,
  currentStep,
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={cn("step-indicator", className)}
      {...props}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep
        const isUpcoming = index > currentStep

        return (
          <div key={index} className="step-indicator-item">
            <div 
              className={cn(
                "step-indicator-circle transition-all duration-300",
                isCompleted && "bg-accent text-accent-foreground",
                isActive && "bg-primary text-primary-foreground animate-pulse-slow",
                isUpcoming && "bg-secondary text-secondary-foreground"
              )}
            >
              {isCompleted ? (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className={cn(
              "text-sm font-medium transition-all duration-300",
              isActive && "text-primary",
              isCompleted && "text-foreground",
              isUpcoming && "text-muted-foreground"
            )}>
              {step}
            </div>
          </div>
        )
      })}
    </div>
  )
})

StepIndicator.displayName = "StepIndicator"

export { StepIndicator } 