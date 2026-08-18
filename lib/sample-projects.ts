import type { LucideIcon } from "lucide-react"
import { Bot, Globe, Smartphone } from "lucide-react"

export type ProjectStatus = "Draft" | "Building" | "Live"

/** The three project types offered in the Create New Project flow (Step 1). */
export type ProjectTypeId = "website" | "mobile" | "ai-system"

/** Shared metadata for each project type: display label + icon. */
export const PROJECT_TYPE_META: Record<ProjectTypeId, { label: string; icon: LucideIcon }> = {
  website: { label: "Website", icon: Globe },
  mobile: { label: "Mobile", icon: Smartphone },
  "ai-system": { label: "AI System", icon: Bot },
}

/**
 * Resolve a project's icon component from its display `type` label.
 * Used when re-hydrating persisted projects, whose icon components cannot
 * be stored in JSON. Falls back to the Website icon for unknown labels.
 */
export function resolveProjectIcon(typeLabel: string): LucideIcon {
  switch (typeLabel) {
    case "Mobile":
      return Smartphone
    case "AI System":
      return Bot
    default:
      return Globe
  }
}

export type SampleProject = {
  id: string
  name: string
  type: string
  technology: string
  status: ProjectStatus
  lastModified: string
  icon: LucideIcon
  /** Extra data captured during creation — attached for future steps. */
  description?: string
  targetAudience?: string
  features?: string[]
  /** ISO timestamp of when the project was created (frontend session only). */
  createdAt?: string
}

/** Values collected across the Create New Project flow. */
export type NewProjectInput = {
  name: string
  type: ProjectTypeId
  description: string
  targetAudience: string
  features: string[]
  technology: string
}

/** Generate a unique, frontend-only project id (no backend involved). */
function generateProjectId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `proj_${crypto.randomUUID()}`
  }
  return `proj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Build a full project object from the values entered in the creation flow.
 * Session-only — status defaults to "Draft" and timestamps are set to now.
 */
export function buildProject(input: NewProjectInput): SampleProject {
  const now = new Date()
  const meta = PROJECT_TYPE_META[input.type]

  return {
    id: generateProjectId(),
    name: input.name.trim(),
    type: meta.label,
    technology: input.technology,
    status: "Draft",
    lastModified: "Last modified just now",
    icon: meta.icon,
    description: input.description.trim(),
    targetAudience: input.targetAudience.trim(),
    features: input.features,
    createdAt: now.toISOString(),
  }
}

/**
 * DEMO / SAMPLE UI DATA ONLY.
 * These are placeholder projects used purely for visual design of the
 * Recent Projects section. They are not real projects and are not backed
 * by any database or backend.
 */
export const sampleProjects: SampleProject[] = [
  {
    id: "sample-saas-crm",
    name: "SaaS CRM",
    type: "Website",
    technology: "Next.js",
    status: "Draft",
    lastModified: "Last modified recently",
    icon: Globe,
  },
  {
    id: "sample-billing-app",
    name: "Billing Application",
    type: "Mobile",
    technology: "Android",
    status: "Draft",
    lastModified: "Last modified recently",
    icon: Smartphone,
  },
  {
    id: "sample-ai-support",
    name: "AI Customer Support",
    type: "AI System",
    technology: "AI + RAG",
    status: "Draft",
    lastModified: "Last modified recently",
    icon: Bot,
  },
]
