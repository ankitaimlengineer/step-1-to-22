"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { buildProject, sampleProjects, type NewProjectInput, type SampleProject } from "@/lib/sample-projects"
import { loadProjects, saveProjects } from "@/lib/project-storage"

type ProjectsContextValue = {
  /** All projects for the current session — newest first. */
  projects: SampleProject[]
  /** Create a project from the flow input, prepend it, and toast success. */
  createProject: (input: NewProjectInput) => SampleProject
  /** Look up a single project by id. Returns undefined if not found. */
  getProject: (id: string) => SampleProject | undefined
  /**
   * True once the client-side localStorage load has run. Consumers can wait
   * for this before deciding a project is "not found", avoiding a flash of the
   * not-found state during hydration.
   */
  hydrated: boolean
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null)

/**
 * Shared project state for VOLO AI, persisted to localStorage.
 * Server render + first client render use the sample projects (SSR-safe), then
 * a client-only effect swaps in any saved projects. New projects created via
 * the Create flow are prepended and written back to localStorage so they
 * survive browser refreshes. No backend, API, or authentication involved.
 */
export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  // Initialize with sample projects so the server and first client render
  // match — this avoids hydration mismatches. Saved data is loaded in an
  // effect below, after mount.
  const [projects, setProjects] = useState<SampleProject[]>(() => [...sampleProjects])
  const [toast, setToast] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Client-only: load persisted projects once after mount. If nothing valid
  // is saved (first-time user or corrupted data), keep the sample projects.
  useEffect(() => {
    const saved = loadProjects()
    if (saved) setProjects(saved)
    setHydrated(true)
  }, [])

  const createProject = useCallback((input: NewProjectInput) => {
    const project = buildProject(input)
    setProjects((prev) => {
      // Newest project first, existing projects preserved after it.
      const next = [project, ...prev]
      // Persist the full, ordered list so it survives refresh.
      saveProjects(next)
      return next
    })
    setToast("Project created successfully")
    return project
  }, [])

  const getProject = useCallback(
    (id: string) => projects.find((project) => project.id === id),
    [projects],
  )

  // Auto-dismiss the toast so it stays non-blocking.
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  return (
    <ProjectsContext.Provider value={{ projects, createProject, getProject, hydrated }}>
      {children}

      {/* Non-blocking success toast, styled to match VOLO AI. */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4 sm:inset-x-auto sm:right-6 sm:justify-end"
      >
        {toast ? (
          <div
            role="status"
            className={cn(
              "pointer-events-auto flex items-center gap-2.5 rounded-xl border border-sidebar-primary/40 bg-card px-4 py-3 text-sm font-medium text-foreground shadow-2xl shadow-black/40",
              "animate-in fade-in slide-in-from-bottom-2 duration-200",
            )}
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/15 text-sidebar-primary">
              <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
            </span>
            {toast}
          </div>
        ) : null}
      </div>
    </ProjectsContext.Provider>
  )
}

export function useProjects(): ProjectsContextValue {
  const context = useContext(ProjectsContext)
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider")
  }
  return context
}
