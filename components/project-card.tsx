"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Copy, MoreVertical, Pencil, SquareArrowOutUpRight, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SampleProject } from "@/lib/sample-projects"
import { ProjectStatusBadge } from "@/components/project-status-badge"

type MenuItem = {
  label: string
  icon: typeof Copy
  destructive?: boolean
}

const menuItems: MenuItem[] = [
  { label: "Open", icon: SquareArrowOutUpRight },
  { label: "Rename", icon: Pencil },
  { label: "Duplicate", icon: Copy },
  { label: "Delete", icon: Trash2, destructive: true },
]

export function ProjectCard({
  project,
  className,
}: {
  project: SampleProject
  className?: string
}) {
  const Icon = project.icon
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function onPointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [menuOpen])

  return (
    <div
      className={cn(
        "group relative flex cursor-pointer flex-col rounded-xl border border-border bg-card/60 p-4 text-left transition-colors duration-200 hover:border-sidebar-primary/40 hover:bg-card",
        className,
      )}
    >
      {/* Stretched link overlay: makes the whole card navigate to the project
          details page without nesting interactive elements. The menu below
          sits at a higher z-index so its clicks are not intercepted. */}
      <Link
        href={`/projects/${project.id}`}
        aria-label={`Open ${project.name}`}
        className="absolute inset-0 z-10 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/70"
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 text-sidebar-primary">
          <Icon className="size-[18px]" strokeWidth={2} />
        </div>

        {/* Three-dot menu — above the stretched link so it stays independent */}
        <div className="relative z-20" ref={menuRef}>
          <button
            type="button"
            aria-label={`Open menu for ${project.name}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring/70"
          >
            <MoreVertical className="size-4" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-9 z-20 w-40 overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-lg"
            >
              {menuItems.map((item) => {
                const ItemIcon = item.icon
                return (
                  <button
                    key={item.label}
                    type="button"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm outline-none transition-colors",
                      item.destructive
                        ? "text-destructive hover:bg-destructive/10"
                        : "text-popover-foreground hover:bg-muted/60",
                    )}
                  >
                    <ItemIcon className="size-4" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-foreground">{project.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {project.type} · {project.technology}
        </p>
      </div>

      <div className="mt-4">
        <ProjectStatusBadge status={project.status} />
      </div>

      <p className="mt-auto pt-4 text-xs text-muted-foreground/80">{project.lastModified}</p>
    </div>
  )
}

export default ProjectCard
