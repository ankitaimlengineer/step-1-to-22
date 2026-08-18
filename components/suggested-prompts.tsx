"use client"

import { LayoutDashboard, ShoppingBag, Smartphone, Bot, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Suggestion = {
  label: string
  icon: LucideIcon
}

const SUGGESTIONS: Suggestion[] = [
  { label: "Build a modern SaaS CRM", icon: LayoutDashboard },
  { label: "Create an online jewellery store", icon: ShoppingBag },
  { label: "Build an Android billing app", icon: Smartphone },
  { label: "Create an AI customer support assistant", icon: Bot },
]

export function SuggestedPrompts({
  onSelect,
  className,
}: {
  onSelect?: (prompt: string) => void
  className?: string
}) {
  return (
    <section className={cn("w-full", className)} aria-label="Suggested prompts">
      <h2 className="text-left text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
        Try an idea
      </h2>

      <div className="mt-3 flex flex-wrap justify-start gap-2">
        {SUGGESTIONS.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => onSelect?.(label)}
            className={cn(
              "group inline-flex items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar/60 px-3 py-2 text-sm text-muted-foreground outline-none transition-all",
              "hover:border-sidebar-primary/40 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              "focus-visible:ring-2 focus-visible:ring-sidebar-ring/70",
            )}
          >
            <Icon
              className="size-4 shrink-0 text-muted-foreground/70 transition-colors group-hover:text-sidebar-primary"
              strokeWidth={2}
            />
            <span className="whitespace-nowrap">{label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default SuggestedPrompts
