"use client"

import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  Blocks,
  BrainCircuit,
  CalendarClock,
  Clock,
  Cpu,
  Database,
  FileText,
  Gauge,
  Layers,
  LayoutTemplate,
  Rocket,
  Server,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  Wand2,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { ProjectStatusBadge } from "@/components/project-status-badge"
import type { ProjectStatus, SampleProject } from "@/lib/sample-projects"

/** Format an ISO timestamp into a clean, human-readable date. */
function formatDate(iso?: string): string {
  if (!iso) return "Not available"
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "Not available"
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

/** Short explanatory line for the build status. */
function statusHelpText(status: ProjectStatus): string {
  switch (status) {
    case "Draft":
      return "Your project foundation is ready for the next build stage."
    case "Building":
      return "Your project is currently being assembled by VOLO AI."
    case "Live":
      return "Your project is live and ready to use."
    default:
      return "Status unavailable."
  }
}

/** Rough progress indication per status — visual only, no real build state. */
function statusProgress(status: ProjectStatus): number {
  switch (status) {
    case "Draft":
      return 25
    case "Building":
      return 65
    case "Live":
      return 100
    default:
      return 0
  }
}

/**
 * Split a single technology string into individual badges.
 * Handles common separators ("AI + RAG", "React, Node", "Next.js / Prisma").
 */
function splitTechnologies(technology?: string): string[] {
  if (!technology?.trim()) return []
  return technology
    .split(/[+,/&]|\band\b/gi)
    .map((t) => t.trim())
    .filter(Boolean)
}

/** Technology groups used to organize the stack, in display order. */
type TechCategory = "Frontend" | "Backend" | "Database" | "AI / ML" | "Mobile" | "Tools"

const CATEGORY_ORDER: TechCategory[] = ["Frontend", "Backend", "Database", "AI / ML", "Mobile", "Tools"]

/** One representative icon per category (used on each technology badge). */
const CATEGORY_ICON: Record<TechCategory, LucideIcon> = {
  Frontend: LayoutTemplate,
  Backend: Server,
  Database: Database,
  "AI / ML": BrainCircuit,
  Mobile: Smartphone,
  Tools: Wrench,
}

/**
 * Keyword hints used to sort existing technology names into groups.
 * Purely a display grouping of data that already exists — no technologies
 * are invented. Anything unrecognized falls back to the "Tools" group.
 */
const TECH_KEYWORDS: Record<Exclude<TechCategory, "Tools">, string[]> = {
  // Checked before Frontend so "React Native" resolves to Mobile.
  Mobile: ["android", "ios", "swift", "swiftui", "kotlin", "flutter", "react native", "expo"],
  "AI / ML": ["ai", "rag", "ml", "llm", "gpt", "openai", "langchain", "tensorflow", "pytorch", "nlp", "machine learning"],
  Database: ["postgres", "postgresql", "mysql", "mongo", "mongodb", "sqlite", "redis", "prisma", "supabase", "firebase", "dynamodb", "sql"],
  Backend: ["node", "express", "nest", "django", "flask", "fastapi", "rails", "spring", "golang", "php", "laravel", ".net", "graphql", "rest", "api"],
  Frontend: ["react", "next", "vue", "angular", "svelte", "tailwind", "css", "html", "javascript", "typescript", "remix", "astro", "redux", "vite"],
}

/** Order in which keyword groups are tested (most specific first). */
const CATEGORIZE_ORDER: Exclude<TechCategory, "Tools">[] = ["Mobile", "AI / ML", "Database", "Backend", "Frontend"]

/** Resolve a single technology name to a group using whole-word matching. */
function categorizeTechnology(tech: string): TechCategory {
  const value = tech.toLowerCase()
  for (const category of CATEGORIZE_ORDER) {
    for (const keyword of TECH_KEYWORDS[category]) {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      // Keyword must be bounded by non-letters so short hints ("ai") don't
      // match inside unrelated words ("email").
      const pattern = new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`, "i")
      if (pattern.test(value)) return category
    }
  }
  return "Tools"
}

type TechGroup = { category: TechCategory; icon: LucideIcon; items: string[] }

/** Group the existing technology list into the categories that have data. */
function groupTechnologies(technologies: string[]): TechGroup[] {
  const buckets = new Map<TechCategory, string[]>()
  for (const tech of technologies) {
    const category = categorizeTechnology(tech)
    const existing = buckets.get(category)
    if (existing) existing.push(tech)
    else buckets.set(category, [tech])
  }
  return CATEGORY_ORDER.filter((category) => buckets.has(category)).map((category) => ({
    category,
    icon: CATEGORY_ICON[category],
    items: buckets.get(category) as string[],
  }))
}

/** A small rotating set of minimal icons so feature cards feel distinct. */
const FEATURE_ICONS: LucideIcon[] = [Zap, Workflow, ShieldCheck, Wand2, Blocks, Gauge]

function featureIcon(index: number): LucideIcon {
  return FEATURE_ICONS[index % FEATURE_ICONS.length]
}

/** Elevated card surface used across the overview. */
function Card({
  title,
  icon: Icon,
  action,
  children,
  className,
}: {
  title: string
  icon?: LucideIcon
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border/70 bg-card/50 p-5 shadow-sm shadow-black/20 sm:p-6",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {Icon ? (
            <span className="flex size-7 items-center justify-center rounded-md border border-border/70 bg-muted/30 text-sidebar-primary">
              <Icon className="size-3.5" strokeWidth={2} aria-hidden="true" />
            </span>
          ) : null}
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

/** Label / value pair used in the summary card. */
function SummaryTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/40 p-4">
      <div className="flex items-center gap-1.5 text-muted-foreground/80">
        <Icon className="size-3.5" strokeWidth={2} aria-hidden="true" />
        <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-2 text-sm font-medium text-foreground">{value}</div>
    </div>
  )
}

/** Premium chip/badge for the technology stack with a subtle hover lift. */
function TechBadge({ icon: Icon, children }: { icon?: LucideIcon; children: React.ReactNode }) {
  return (
    <span className="group/badge inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background/40 px-2.5 py-1.5 text-xs font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-sidebar-primary/50 hover:bg-sidebar-primary/10 hover:text-sidebar-primary">
      {Icon ? (
        <Icon
          className="size-3.5 text-sidebar-primary/80 transition-colors duration-200 group-hover/badge:text-sidebar-primary"
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </span>
  )
}

/**
 * VOLO AI — Project Overview content (Steps 18–19).
 * Display-only overview shown when the Overview tab is active. All data comes
 * from the existing selected project object — no new state, provider, storage,
 * or functionality. The "Continue to Build" button is a visual placeholder.
 */
export function ProjectOverview({ project }: { project: SampleProject }) {
  const features = Array.isArray(project.features) ? project.features.filter(Boolean) : []
  const hasFeatures = features.length > 0
  const hasDescription = Boolean(project.description?.trim())
  const hasAudience = Boolean(project.targetAudience?.trim())
  const technologies = splitTechnologies(project.technology)
  const hasTechnology = technologies.length > 0
  const techGroups = groupTechnologies(technologies)
  const statusText = statusHelpText(project.status)
  const progress = statusProgress(project.status)

  return (
    <div className="mt-8">
      {/* Overview intro */}
      <div>
        <h1 className="text-balance text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Project Overview
        </h1>
        <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
          Review your project details, technology choices, and current build status.
        </p>
      </div>

      {/* 1 — PROJECT SUMMARY (wide) */}
      <Card title="Project summary" icon={FileText} className="mt-6">
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          {hasDescription ? project.description : "No description provided yet."}
        </p>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryTile icon={Layers} label="Project type" value={project.type || "Not specified"} />
          <SummaryTile
            icon={Cpu}
            label="Framework"
            value={hasTechnology ? project.technology : "Not specified"}
          />
          <SummaryTile
            icon={Users}
            label="Target audience"
            value={hasAudience ? project.targetAudience : "Not specified"}
          />
        </div>
      </Card>

      {/* Two-column layout on desktop; stacked on mobile */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column — features + tech */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* 2 — KEY FEATURES (Step 20) */}
          <section className="rounded-xl border border-border/70 bg-card/50 p-5 shadow-sm shadow-black/20 sm:p-6">
            {/* Section header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-md border border-border/70 bg-muted/30 text-sidebar-primary">
                  <Sparkles className="size-3.5" strokeWidth={2} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Key Features</h2>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    Core capabilities included in this project.
                  </p>
                </div>
              </div>
              {hasFeatures ? (
                <span className="mt-0.5 shrink-0 text-xs font-medium text-muted-foreground/70">
                  {features.length} {features.length === 1 ? "feature" : "features"}
                </span>
              ) : null}
            </div>

            {/* Feature cards: 3-col desktop / 2-col tablet / 1-col mobile */}
            {hasFeatures ? (
              <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => {
                  const FeatureIcon = featureIcon(index)
                  return (
                    <li key={`${feature}-${index}`} className="group">
                      <div className="flex h-full flex-col gap-2.5 rounded-lg border border-border/60 bg-background/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-sidebar-primary/40 hover:bg-background/60">
                        <span className="flex size-8 items-center justify-center rounded-md border border-sidebar-primary/25 bg-sidebar-primary/10 text-sidebar-primary transition-colors duration-200 group-hover:border-sidebar-primary/45 group-hover:bg-sidebar-primary/20">
                          <FeatureIcon className="size-4" strokeWidth={2} aria-hidden="true" />
                        </span>
                        <p className="text-pretty text-sm font-medium leading-snug text-foreground">{feature}</p>
                        <p className="text-xs leading-relaxed text-muted-foreground">Feature details not specified.</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                No key features added yet. Features you capture during setup will appear here.
              </p>
            )}
          </section>

          {/* 3 — TECHNOLOGY STACK */}
          <section className="rounded-xl border border-border/70 bg-card/50 p-5 shadow-sm shadow-black/20 sm:p-6">
            {/* Section header */}
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md border border-border/70 bg-muted/30 text-sidebar-primary">
                <Layers className="size-3.5" strokeWidth={2} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Technology Stack</h2>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Technologies and tools used to build this project.
                </p>
              </div>
            </div>

            {/* Grouped technology badges */}
            {hasTechnology ? (
              <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                {techGroups.map((group) => (
                  <div key={group.category}>
                    <div className="flex items-center gap-1.5 text-muted-foreground/80">
                      <group.icon className="size-3.5" strokeWidth={2} aria-hidden="true" />
                      <h3 className="text-[11px] font-medium uppercase tracking-wide">{group.category}</h3>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {group.items.map((tech, index) => (
                        <TechBadge key={`${group.category}-${tech}-${index}`} icon={group.icon}>
                          {tech}
                        </TechBadge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">Not specified</p>
            )}
          </section>
        </div>

        {/* Right column — status + activity */}
        <div className="flex flex-col gap-6">
          {/* 4 — BUILD STATUS */}
          <Card title="Build status" icon={Clock}>
            <div className="flex flex-col gap-3">
              <ProjectStatusBadge status={project.status} className="self-start" />
              <p className="text-xs leading-relaxed text-muted-foreground">{statusText}</p>

              {/* Subtle progress indicator (visual only) */}
              <div className="mt-1">
                <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground/80">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div
                  className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted/50"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Build progress"
                >
                  <div
                    className="h-full rounded-full bg-sidebar-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-1 flex items-center gap-1.5 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                <CalendarClock className="size-3.5" strokeWidth={2} aria-hidden="true" />
                {project.lastModified || "Not available"}
              </div>
            </div>
          </Card>

          {/* 5 — RECENT ACTIVITY */}
          <Card title="Recent activity" icon={CalendarClock}>
            <ol className="relative flex flex-col">
              <li className="relative flex gap-3 pb-4">
                <span className="absolute left-[7px] top-5 h-full w-px bg-border/70" aria-hidden="true" />
                <span className="mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full border border-sidebar-primary/40 bg-sidebar-primary/15">
                  <span className="size-1.5 rounded-full bg-sidebar-primary" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Project created</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Initial project set up in VOLO AI.
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground/70">{formatDate(project.createdAt)}</p>
                </div>
              </li>
              <li className="relative flex gap-3">
                <span className="mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full border border-border/70 bg-muted/40">
                  <span className="size-1.5 rounded-full bg-muted-foreground" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Last updated</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Most recent change to this project.
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground/70">
                    {project.lastModified || "Not available"}
                  </p>
                </div>
              </li>
            </ol>
          </Card>
        </div>
      </div>

      {/* 6 — READY TO BUILD callout (visual only) */}
      <section className="mt-6 flex flex-col items-start justify-between gap-4 overflow-hidden rounded-xl border border-sidebar-primary/25 bg-gradient-to-br from-sidebar-primary/10 to-transparent p-6 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-sidebar-primary/30 bg-sidebar-primary/15 text-sidebar-primary">
            <Rocket className="size-5" strokeWidth={2} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground">Ready to build?</h2>
            <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
              Your project foundation is ready. Continue to the build workspace when you&apos;re ready to start.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-sidebar-primary px-5 text-sm font-medium text-sidebar-primary-foreground outline-none transition-colors hover:bg-sidebar-primary/90 focus-visible:ring-2 focus-visible:ring-sidebar-ring/70"
        >
          Continue to Build
          <ArrowRight className="size-4" strokeWidth={2} aria-hidden="true" />
        </button>
      </section>
    </div>
  )
}

export default ProjectOverview
