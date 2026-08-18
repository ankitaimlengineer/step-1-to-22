"use client"

import Link from "next/link"
import { ArrowLeft, Eye, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { ProjectStatusBadge } from "@/components/project-status-badge"
import { resolveProjectIcon, type SampleProject } from "@/lib/sample-projects"

const WORKSPACE_TABS = [
  { id: "overview", label: "Overview" },
  { id: "build", label: "Build" },
  { id: "settings", label: "Settings" },
] as const

export type WorkspaceTabId = (typeof WORKSPACE_TABS)[number]["id"]

/** Tabs that are wired up to real content. Others stay visually disabled. */
const FUNCTIONAL_TABS: readonly WorkspaceTabId[] = ["overview", "build"]

/**
 * VOLO AI — Project Workspace Header (Step 17).
 *
 * Visual-only header for the Project Details page. Renders the selected
 * project's identity (icon, name, type, status, last modified), placeholder
 * action buttons (Preview / More), and the workspace tab navigation
 * (Overview / Build / Settings). No project state is created or mutated here —
 * the project object is passed in from the existing shared, persisted state.
 * Preview, More, Build, and Settings are intentionally non-functional.
 */
export function ProjectWorkspaceHeader({
  project,
  activeTab,
  onTabChange,
}: {
  project: SampleProject
  activeTab: WorkspaceTabId
  onTabChange: (tab: WorkspaceTabId) => void
}) {
  const TypeIcon = resolveProjectIcon(project.type)

  return (
    <header className="border-b border-border">
      {/* Back navigation (client-side, uses existing route) */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring/70"
      >
        <ArrowLeft className="size-4" strokeWidth={2.25} />
        Back to Projects
      </Link>

      {/* Identity row + placeholder actions */}
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/40 text-sidebar-primary">
            <TypeIcon className="size-5" strokeWidth={2} aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="truncate text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {project.name}
              </h1>
              <ProjectStatusBadge status={project.status} />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span>{project.type}</span>
              <span aria-hidden="true" className="text-muted-foreground/40">
                &middot;
              </span>
              <span>{project.lastModified}</span>
            </div>
          </div>
        </div>

        {/* Placeholder actions — visual only, no functionality yet */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Preview (coming soon)"
            className="inline-flex h-9 cursor-not-allowed items-center gap-2 rounded-md border border-border bg-card/60 px-3 text-sm font-medium text-muted-foreground opacity-70"
          >
            <Eye className="size-4" strokeWidth={2} aria-hidden="true" />
            Preview
          </button>
          <button
            type="button"
            disabled
            aria-disabled="true"
            aria-label="More options"
            title="More (coming soon)"
            className="inline-flex size-9 cursor-not-allowed items-center justify-center rounded-md border border-border bg-card/60 text-muted-foreground opacity-70"
          >
            <MoreHorizontal className="size-4" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Workspace tabs — appearance only; Overview active by default */}
      <nav aria-label="Workspace sections" className="mt-6 -mb-px overflow-x-auto">
        <ul className="flex min-w-max items-center gap-1">
          {WORKSPACE_TABS.map((tab) => {
            const isActive = tab.id === activeTab
            const isFunctional = FUNCTIONAL_TABS.includes(tab.id)
            return (
              <li key={tab.id}>
                <button
                  type="button"
                  onClick={isFunctional ? () => onTabChange(tab.id) : undefined}
                  disabled={!isFunctional}
                  aria-current={isActive ? "page" : undefined}
                  aria-disabled={!isFunctional}
                  className={cn(
                    "relative inline-flex h-9 items-center border-b-2 px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sidebar-ring/70",
                    isActive
                      ? "border-sidebar-primary text-foreground"
                      : isFunctional
                        ? "border-transparent text-muted-foreground hover:text-foreground"
                        : "cursor-not-allowed border-transparent text-muted-foreground/70",
                  )}
                >
                  {tab.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}

export default ProjectWorkspaceHeader
