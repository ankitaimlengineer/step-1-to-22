"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { useProjects } from "@/components/projects-provider"
import { ProjectWorkspaceHeader, type WorkspaceTabId } from "@/components/project-workspace-header"
import { ProjectOverview } from "@/components/project-overview"
import { ProjectBuild } from "@/components/project-build"

/** Consistent "Back to Projects" control used by both details and error states. */
function BackToProjects() {
  return (
    <Link
      href="/projects"
      className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring/70"
    >
      <ArrowLeft className="size-4" strokeWidth={2.25} />
      Back to Projects
    </Link>
  )
}

/**
 * VOLO AI — Project Details / Workspace page foundation (Step 16).
 * Reads the selected project from the shared, persisted project state and
 * renders its metadata plus an empty workspace placeholder. No editing,
 * deletion, or builder functionality — visual foundation only.
 */
export function ProjectDetailsPage({ projectId }: { projectId: string }) {
  const { getProject, hydrated } = useProjects()
  const project = getProject(projectId)
  const [activeTab, setActiveTab] = useState<WorkspaceTabId>("overview")

  // Wait for the client-side localStorage load before judging a project as
  // missing, so a freshly persisted project doesn't flash "not found".
  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <div className="h-6 w-40 animate-pulse rounded-md bg-muted/50" />
        <div className="mt-4 h-9 w-64 animate-pulse rounded-md bg-muted/50" />
        <div className="mt-8 h-40 w-full animate-pulse rounded-xl bg-muted/30" />
      </div>
    )
  }

  // Invalid / missing project — clean error state, never a crash.
  if (!project) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <BackToProjects />
        <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-border bg-card/60 px-6 py-16 text-center">
          <h1 className="text-balance text-xl font-semibold text-foreground sm:text-2xl">Project not found</h1>
          <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
            The project you&apos;re looking for doesn&apos;t exist or is no longer available.
          </p>
          <Link
            href="/projects"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-sidebar-primary px-4 text-sm font-medium text-sidebar-primary-foreground outline-none transition-colors hover:bg-sidebar-primary/90 focus-visible:ring-2 focus-visible:ring-sidebar-ring/70"
          >
            <ArrowLeft className="size-4" strokeWidth={2.25} />
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8">
      {/* Project Workspace Header (Step 17) — identity, actions, tabs */}
      <ProjectWorkspaceHeader project={project} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Active tab content */}
      {activeTab === "overview" ? <ProjectOverview project={project} /> : null}
      {activeTab === "build" ? <ProjectBuild project={project} /> : null}
    </div>
  )
}

export default ProjectDetailsPage
