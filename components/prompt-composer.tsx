"use client"

import { useEffect, useRef, useState } from "react"
import { Paperclip, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const PLACEHOLDER = "Describe your idea, VOLО AI will bring it to life..."

export function PromptComposer({
  className,
  value: controlledValue,
  onValueChange,
}: {
  className?: string
  value?: string
  onValueChange?: (value: string) => void
}) {
  const [internalValue, setInternalValue] = useState("")
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue
  const setValue = (next: string) => {
    if (!isControlled) setInternalValue(next)
    onValueChange?.(next)
  }
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isEmpty = value.trim().length === 0

  // Auto-grow the textarea to fit content, within a comfortable range.
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "0px"
    const next = Math.min(Math.max(el.scrollHeight, 120), 320)
    el.style.height = `${next}px`
  }, [value])

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "group relative flex flex-col rounded-2xl border border-sidebar-border bg-sidebar/80 text-left shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_20px_40px_-24px_rgba(0,0,0,0.8)] backdrop-blur-sm transition-colors",
          "focus-within:border-sidebar-primary/50",
        )}
      >
        {/* Subtle focus glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 ring-1 ring-sidebar-primary/25 transition-opacity duration-300 group-focus-within:opacity-100"
        />

        <label htmlFor="volo-prompt" className="sr-only">
          Project description
        </label>
        <textarea
          id="volo-prompt"
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={3}
          className="relative w-full resize-none bg-transparent px-5 pt-5 text-[15px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/70"
        />

        <div className="relative flex items-center justify-between gap-3 px-4 pb-4 pt-2">
          <button
            type="button"
            aria-label="Attach a file"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring/70"
          >
            <Paperclip className="size-[18px]" strokeWidth={2} />
          </button>

          <button
            type="button"
            disabled={isEmpty}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium outline-none transition-all",
              "focus-visible:ring-2 focus-visible:ring-sidebar-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
              isEmpty
                ? "cursor-not-allowed bg-sidebar-accent text-muted-foreground/60"
                : "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm hover:bg-sidebar-primary/90 active:scale-[0.98]",
            )}
          >
            <Sparkles className="size-4" strokeWidth={2.25} />
            Generate
          </button>
        </div>
      </div>
    </div>
  )
}

export default PromptComposer
