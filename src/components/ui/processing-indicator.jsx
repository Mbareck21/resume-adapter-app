import * as React from "react"
import { cn } from "@/lib/utils"

const ProcessingIndicator = React.forwardRef(({
  className,
  steps = [],
  currentStep = 0,
  progress = 0,
  message,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col items-center p-8 text-center", className)}
      {...props}
    >
      <div className="relative w-24 h-24 mb-6">
        {/* Circular progress indicator */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-secondary/30 stroke-current"
            strokeWidth="10"
            cx="50"
            cy="50"
            r="40"
            fill="none"
          ></circle>
          
          {/* Progress circle */}
          <circle
            className="text-primary stroke-current transition-all duration-500 ease-in-out"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={Math.ceil(251.2)}
            strokeDashoffset={Math.ceil(251.2 * (1 - progress / 100))}
            cx="50"
            cy="50"
            r="40"
            fill="none"
            transform="rotate(-90 50 50)"
          ></circle>
        </svg>
        
        {/* Percentage in the middle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{Math.round(progress)}%</span>
        </div>
      </div>
      
      {/* Current operation message */}
      {message && (
        <p className="text-lg font-medium mb-4 animate-pulse">{message}</p>
      )}
      
      {/* Steps progress */}
      {steps.length > 0 && (
        <div className="w-full max-w-md space-y-3 mt-2">
          {steps.map((step, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className={cn(
                  index < currentStep ? "text-accent" : 
                  index === currentStep ? "text-foreground" : 
                  "text-muted-foreground"
                )}>
                  {step}
                </span>
                {index < currentStep && (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="text-accent"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <div className="w-full bg-secondary/30 rounded-full h-1.5">
                <div 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-700 ease-in-out",
                    index < currentStep ? "bg-accent w-full" :
                    index === currentStep ? "bg-primary" : "bg-transparent"
                  )}
                  style={{
                    width: index === currentStep ? `${progress}%` : index < currentStep ? '100%' : '0%'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

ProcessingIndicator.displayName = "ProcessingIndicator"

export { ProcessingIndicator } 