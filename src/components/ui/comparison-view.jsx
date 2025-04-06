import * as React from "react"
import { cn } from "@/lib/utils"

const ComparisonView = React.forwardRef(({
  className,
  original,
  adapted,
  originalTitle = "Original Resume",
  adaptedTitle = "Adapted Resume",
  showDiff = false,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8", className)}
      {...props}
    >
      {/* Original content column */}
      <div className="flex flex-col">
        <div className="text-lg font-semibold mb-2 text-foreground">{originalTitle}</div>
        <div className="flex-1 rounded-lg bg-card/50 border border-border p-4 overflow-auto">
          {original}
        </div>
      </div>
      
      {/* Adapted content column */}
      <div className="flex flex-col">
        <div className="text-lg font-semibold mb-2 text-primary">{adaptedTitle}</div>
        <div className="flex-1 rounded-lg bg-card border border-primary/20 p-4 overflow-auto">
          {adapted}
        </div>
      </div>
    </div>
  )
})

ComparisonView.displayName = "ComparisonView"

// This helper function can be used to highlight differences
const HighlightedText = React.forwardRef(({
  className,
  text,
  highlightPattern,
  highlightClassName = "bg-primary/20 text-foreground rounded px-1",
  ...props
}, ref) => {
  if (!highlightPattern || !text) {
    return <span ref={ref} className={className} {...props}>{text}</span>
  }
  
  const parts = text.split(new RegExp(`(${highlightPattern})`, 'gi'))
  
  return (
    <span ref={ref} className={className} {...props}>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === highlightPattern.toLowerCase()
        return isMatch 
          ? <span key={index} className={highlightClassName}>{part}</span>
          : part
      })}
    </span>
  )
})

HighlightedText.displayName = "HighlightedText"

export { ComparisonView, HighlightedText } 