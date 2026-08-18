"use client"

import { useState } from "react"
import { ArrowUpRight, Bot, Globe, Smartphone, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type ProjectType = "website" | "mobile" | "ai-system"

type ProjectOption = {
  id: ProjectType
  title: string
  description: string
  icon: LucideIcon
}

const options: ProjectOption[] = [
  {
    id: "website",
    title: "Website",
    description: "Websites, SaaS apps, dashboards and web applications.",
    icon: Globe,
  },
  {
    id: "mobile",
    title: "Mobile",
    description: "Mobile applications for Android and iOS.",
    icon: Smartphone,
  },
  {
    id: "ai-system",
    title: "AI System",
    description: "AI agents, RAG systems, automation and intelligent applications.",
    icon: Bot,
  },
]

export function VoloProjectTypeSelector({
  className,
  defaultValue = "website",
  onChange,
}: {
  className?: string
  defaultValue?: ProjectType
  onChange?: (value: ProjectType) => void
}) {
  const [selected, setSelected] = useState<ProjectType>(defaultValue)

  function handleSelect(value: ProjectType) {
    setSelected(value)
    onChange?.(value)
  }

  return (
    <div
      role="radiogroup"
      aria-label="Project type"
      className={cn("grid w-full grid-cols-1 gap-3 text-left sm:grid-cols-3", className)}
    >
      {options.map(({ id, title, description, icon: Icon }) => {
        const isSelected = selected === id
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => handleSelect(id)}
            className={cn(
              "group relative flex flex-col rounded-xl border p-4 outline-none transition-all duration-200",
              "focus-visible:ring-2 focus-visible:ring-sidebar-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isSelected
                ? "border-sidebar-primary/60 bg-sidebar-primary/[0.07] shadow-[0_0_0_1px_var(--sidebar-primary)/20]"
                : "border-border bg-card/40 hover:border-border/80 hover:bg-card/70",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg border transition-colors",
                  isSelected
                    ? "border-sidebar-primary/40 bg-sidebar-primary/15 text-sidebar-primary"
                    : "border-border bg-background/60 text-muted-foreground group-hover:text-foreground",
                )}
              >
                <Icon className="size-[18px]" strokeWidth={2} aria-hidden="true" />
              </span>

              {isSelected ? (
                <span
                  className="size-2 rounded-full bg-sidebar-primary shadow-[0_0_0_3px_var(--sidebar-primary)/20]"
                  aria-hidden="true"
                />
              ) : (
                <ArrowUpRight
                  className="size-4 text-muted-foreground/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  aria-hidden="true"
                />
              )}
            </div>

            <h3
              className={cn(
                "mt-4 text-left text-sm font-semibold tracking-tight",
                isSelected ? "text-foreground" : "text-foreground/90",
              )}
            >
              {title}
            </h3>
            <p className="mt-1 text-pretty text-left text-[13px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          </button>
        )
      })}
    </div>
  )
}

export default VoloProjectTypeSelector
