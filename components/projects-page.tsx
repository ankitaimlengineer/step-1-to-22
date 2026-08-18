"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/project-card"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { useProjects } from "@/components/projects-provider"

/**
 * VOLO AI — Projects page.
 * Page heading, subtitle, a UI-only "Create New Project" action, and a
 * responsive grid of sample project cards. No backend, search, filters,
 * or sorting — visual foundation only.
 */
export function ProjectsPage() {
  const { projects } = useProjects()

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        {/* Page header — title/subtitle left, primary action right (stacks on mobile) */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Projects
            </h1>
            <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              Manage and continue building your software projects.
            </p>
          </div>

          <CreateProjectDialog>
            <Button
              type="button"
              className="h-10 w-full shrink-0 gap-2 bg-sidebar-primary text-sidebar-primary-foreground transition-colors hover:bg-sidebar-primary/90 active:bg-sidebar-primary/80 sm:w-auto"
            >
              <Plus className="size-4" strokeWidth={2.25} />
              Create New Project
            </Button>
          </CreateProjectDialog>
        </header>

        {/* Project grid — 1 / 2 / 3 columns across mobile / tablet / desktop */}
        <div className="mt-8 flex-1 pb-16 sm:mt-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectsPage
