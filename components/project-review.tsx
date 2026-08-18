"use client"

import { ArrowLeft, Bot, Check, Globe, Pencil, Smartphone, TriangleAlert, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type ProjectType = "website" | "mobile" | "ai-system"

const TYPE_META: Record<ProjectType, { label: string; icon: LucideIcon }> = {
  website: { label: "Website", icon: Globe },
  mobile: { label: "Mobile", icon: Smartphone },
  "ai-system": { label: "AI System", icon: Bot },
}

const STEPS = [
  { id: 1, label: "Project" },
  { id: 2, label: "Configure" },
  { id: 3, label: "Review" },
] as const

/**
 * VOLO AI — Step 3 review view, rendered inside the Create New Project dialog.
 * UI-only: reads project data from the parent dialog and lets the user jump
 * back to earlier steps to edit. "Create Project" does NOT persist anything —
 * it only surfaces a temporary placeholder state.
 */
export function ProjectReview({
  projectType,
  projectName,
  description,
  audience,
  features,
  tech,
  error,
  onEditDetails,
  onEditConfigure,
  onBack,
  onCreate,
}: {
  projectType: ProjectType
  projectName: string
  description: string
  audience: string
  features: string[]
  tech: string
  error?: string | null
  onEditDetails: () => void
  onEditConfigure: () => void
  onBack: () => void
  onCreate: () => void
}) {
  const TypeIcon = TYPE_META[projectType].icon

  return (
    <div>
      {/* Header */}
      <div className="pr-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Step 3 of 3
        </p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
          Review your project
        </h2>
        <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
          Everything looks good? Review your project details before creating it.
        </p>
      </div>

      {/* Progress indicator */}
      <ol className="mt-5 flex items-center gap-2" aria-label="Progress">
        {STEPS.map((step, index) => {
          const isDone = step.id < 3
          const isCurrent = step.id === 3
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
                  className={cn("h-px flex-1", isDone ? "bg-sidebar-primary/40" : "bg-border")}
                />
              ) : null}
            </li>
          )
        })}
      </ol>

      {/* Summary card */}
      <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card/40">
        <div className="flex items-center justify-between gap-3 border-b border-border/70 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-sidebar-primary/40 bg-sidebar-primary/15 text-sidebar-primary">
              <TypeIcon className="size-5" strokeWidth={2} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Project details
              </p>
              <p className="truncate text-base font-semibold tracking-tight text-foreground">
                {projectName}
              </p>
            </div>
          </div>
          <EditButton label="Edit project details" onClick={onEditDetails} />
        </div>

        <dl className="grid grid-cols-1 divide-y divide-border/70 sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
          <div className="p-4">
            <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Project type</dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {TYPE_META[projectType].label}
            </dd>
          </div>
          <div className="p-4">
            <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Technology</dt>
            <dd className="mt-1 text-sm font-medium text-foreground">{tech}</dd>
          </div>
        </dl>
      </div>

      {/* Description */}
      <ReviewSection title="Description" onEdit={onEditConfigure}>
        {description.trim() ? (
          <p className="rounded-lg border border-border/70 bg-background/50 p-3 text-sm leading-relaxed text-foreground/90">
            {description.trim()}
          </p>
        ) : (
          <EmptyLine>No description added</EmptyLine>
        )}
      </ReviewSection>

      {/* Target audience */}
      <ReviewSection title="Target audience" onEdit={onEditConfigure}>
        {audience.trim() ? (
          <p className="rounded-lg border border-border/70 bg-background/50 p-3 text-sm leading-relaxed text-foreground/90">
            {audience.trim()}
          </p>
        ) : (
          <EmptyLine>No target audience added</EmptyLine>
        )}
      </ReviewSection>

      {/* Key features */}
      <ReviewSection title="Key features" onEdit={onEditConfigure}>
        {features.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {features.map((feature) => (
              <li
                key={feature}
                className="rounded-full border border-sidebar-primary/30 bg-sidebar-primary/10 px-3 py-1 text-xs font-medium text-foreground"
              >
                {feature}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyLine>No key features added</EmptyLine>
        )}
      </ReviewSection>

      {/* Validation message — shown when required data is missing on create. */}
      {error ? (
        <div
          role="alert"
          className="mt-5 flex items-start gap-2.5 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-foreground"
        >
          <TriangleAlert
            className="mt-0.5 size-4 shrink-0 text-destructive"
            strokeWidth={2.25}
            aria-hidden="true"
          />
          <span className="text-pretty leading-relaxed">{error}</span>
        </div>
      ) : null}

      {/* Actions */}
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onBack} className="h-10 gap-1.5 sm:w-auto">
          <ArrowLeft className="size-4" strokeWidth={2} aria-hidden="true" />
          Back
        </Button>
        <Button
          type="button"
          onClick={onCreate}
          className="h-10 bg-sidebar-primary text-sidebar-primary-foreground transition-colors hover:bg-sidebar-primary/90 active:bg-sidebar-primary/80 sm:w-auto"
        >
          Create Project
        </Button>
      </div>
    </div>
  )
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit: () => void
  children: React.ReactNode
}) {
  return (
    <section className="mt-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <EditButton label={`Edit ${title.toLowerCase()}`} onClick={onEdit} />
      </div>
      {children}
    </section>
  )
}

function EditButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors",
        "hover:bg-muted hover:text-foreground",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
      )}
    >
      <Pencil className="size-3" strokeWidth={2} aria-hidden="true" />
      Edit
    </button>
  )
}

function EmptyLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-border bg-background/40 p-3 text-sm italic text-muted-foreground">
      {children}
    </p>
  )
}

export default ProjectReview
