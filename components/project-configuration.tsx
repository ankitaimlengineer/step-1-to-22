"use client"

import { useState } from "react"
import { ArrowLeft, Bot, Check, Globe, Plus, Smartphone, X, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type ProjectType = "website" | "mobile" | "ai-system"

const TYPE_META: Record<ProjectType, { label: string; icon: LucideIcon }> = {
  website: { label: "Website", icon: Globe },
  mobile: { label: "Mobile", icon: Smartphone },
  "ai-system": { label: "AI System", icon: Bot },
}

const TECH_OPTIONS = [
  "Let VOLO AI decide",
  "Next.js",
  "React",
  "Node.js",
  "Python",
  "FastAPI",
  "Android",
  "Kotlin",
] as const

const STEPS = [
  { id: 1, label: "Project" },
  { id: 2, label: "Configure" },
  { id: 3, label: "Review" },
] as const

/**
 * VOLO AI — Step 2 configuration view, rendered inside the Create New Project
 * dialog after Continue. UI-only: all state is local, no backend, no API,
 * no navigation. Continue does not create a project.
 */
export function ProjectConfiguration({
  projectType,
  projectName,
  description,
  audience,
  features,
  tech,
  onDescriptionChange,
  onAudienceChange,
  onFeaturesChange,
  onTechChange,
  onBack,
  onContinue,
}: {
  projectType: ProjectType
  projectName: string
  description: string
  audience: string
  features: string[]
  tech: string
  onDescriptionChange: (value: string) => void
  onAudienceChange: (value: string) => void
  onFeaturesChange: (value: string[]) => void
  onTechChange: (value: string) => void
  onBack: () => void
  onContinue: () => void
}) {
  const [featureDraft, setFeatureDraft] = useState("")

  const TypeIcon = TYPE_META[projectType].icon
  const canContinue = projectName.trim().length > 0 && description.trim().length > 0

  function addFeature() {
    const value = featureDraft.trim()
    if (!value) return
    // De-dupe case-insensitively while preserving the user's original casing.
    const exists = features.some((f) => f.toLowerCase() === value.toLowerCase())
    if (!exists) onFeaturesChange([...features, value])
    setFeatureDraft("")
  }

  function removeFeature(target: string) {
    onFeaturesChange(features.filter((f) => f !== target))
  }

  function handleFeatureKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.nativeEvent.isComposing && event.keyCode !== 229) {
      event.preventDefault()
      addFeature()
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Step 2 of 3
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
            Configure your project
          </h2>
          <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
            Tell VOLO AI a little more about what you want to build.
          </p>
        </div>
      </div>

      {/* Progress indicator */}
      <ol className="mt-5 flex items-center gap-2" aria-label="Progress">
        {STEPS.map((step, index) => {
          const isDone = step.id < 2
          const isCurrent = step.id === 2
          return (
            <li key={step.id} className="flex flex-1 items-center gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors",
                    isDone && "border-sidebar-primary/50 bg-sidebar-primary/15 text-sidebar-primary",
                    isCurrent && "border-sidebar-primary bg-sidebar-primary text-sidebar-primary-foreground",
                    !isDone && !isCurrent && "border-border bg-background/60 text-muted-foreground",
                  )}
                >
                  {isDone ? <Check className="size-3" strokeWidth={2.5} aria-hidden="true" /> : step.id}
                </span>
                <span
                  className={cn(
                    "truncate text-xs font-medium",
                    isCurrent ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px flex-1",
                    isDone ? "bg-sidebar-primary/40" : "bg-border",
                  )}
                />
              ) : null}
            </li>
          )
        })}
      </ol>

      {/* Project summary */}
      <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-border bg-card/40 p-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-sidebar-primary/40 bg-sidebar-primary/15 text-sidebar-primary">
            <TypeIcon className="size-[18px]" strokeWidth={2} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {TYPE_META[projectType].label}
            </p>
            <p className="truncate text-sm font-semibold text-foreground">{projectName}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground outline-none transition-colors",
            "hover:bg-muted hover:text-foreground",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          )}
        >
          <ArrowLeft className="size-3.5" strokeWidth={2} aria-hidden="true" />
          Back
        </button>
      </div>

      {/* Form */}
      <div className="mt-5 space-y-5">
        {/* Project description */}
        <div>
          <label htmlFor="volo-project-description" className="text-sm font-medium text-foreground">
            Project description
          </label>
          <textarea
            id="volo-project-description"
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            rows={4}
            placeholder="Describe what you want your project to do..."
            className={cn(
              "mt-2 w-full resize-none rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none transition-colors",
              "placeholder:text-muted-foreground/70",
              "hover:border-border/80",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            )}
          />
        </div>

        {/* Target audience */}
        <div>
          <label htmlFor="volo-project-audience" className="text-sm font-medium text-foreground">
            Target audience
          </label>
          <input
            id="volo-project-audience"
            type="text"
            value={audience}
            onChange={(event) => onAudienceChange(event.target.value)}
            placeholder="Who is this project for?"
            autoComplete="off"
            className={cn(
              "mt-2 h-10 w-full rounded-lg border border-border bg-background/60 px-3 text-sm text-foreground outline-none transition-colors",
              "placeholder:text-muted-foreground/70",
              "hover:border-border/80",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            )}
          />
        </div>

        {/* Key features */}
        <div>
          <span className="text-sm font-medium text-foreground">Key features</span>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={featureDraft}
              onChange={(event) => setFeatureDraft(event.target.value)}
              onKeyDown={handleFeatureKeyDown}
              placeholder="Add a key feature..."
              autoComplete="off"
              aria-label="Add a key feature"
              className={cn(
                "h-10 w-full rounded-lg border border-border bg-background/60 px-3 text-sm text-foreground outline-none transition-colors",
                "placeholder:text-muted-foreground/70",
                "hover:border-border/80",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              )}
            />
            <button
              type="button"
              onClick={addFeature}
              disabled={featureDraft.trim().length === 0}
              aria-label="Add feature"
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-muted-foreground outline-none transition-colors",
                "hover:bg-muted hover:text-foreground",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background/60 disabled:hover:text-muted-foreground",
              )}
            >
              <Plus className="size-4" strokeWidth={2.25} aria-hidden="true" />
            </button>
          </div>

          {features.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {features.map((feature) => (
                <li key={feature}>
                  <span className="flex items-center gap-1.5 rounded-full border border-sidebar-primary/30 bg-sidebar-primary/10 py-1 pl-3 pr-1.5 text-xs font-medium text-foreground">
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(feature)}
                      aria-label={`Remove ${feature}`}
                      className={cn(
                        "flex size-4 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors",
                        "hover:bg-sidebar-primary/20 hover:text-foreground",
                        "focus-visible:ring-2 focus-visible:ring-ring/50",
                      )}
                    >
                      <X className="size-3" strokeWidth={2.25} aria-hidden="true" />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* Technology preference */}
        <div>
          <label htmlFor="volo-project-tech" className="text-sm font-medium text-foreground">
            Technology preference
          </label>
          <select
            id="volo-project-tech"
            value={tech}
            onChange={(event) => onTechChange(event.target.value)}
            className={cn(
              "mt-2 h-10 w-full appearance-none rounded-lg border border-border bg-background/60 px-3 text-sm text-foreground outline-none transition-colors",
              "bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pr-9",
              "hover:border-border/80",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            )}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
            }}
          >
            {TECH_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onBack} className="h-10 gap-1.5 sm:w-auto">
          <ArrowLeft className="size-4" strokeWidth={2} aria-hidden="true" />
          Back
        </Button>
        <Button
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className="h-10 bg-sidebar-primary text-sidebar-primary-foreground transition-colors hover:bg-sidebar-primary/90 active:bg-sidebar-primary/80 sm:w-auto"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

export default ProjectConfiguration
