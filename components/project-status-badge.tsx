import { cn } from "@/lib/utils"
import type { ProjectStatus } from "@/lib/sample-projects"

const statusStyles: Record<ProjectStatus, string> = {
  Draft: "border-border bg-muted/40 text-muted-foreground",
  Building: "border-sidebar-primary/30 bg-sidebar-primary/10 text-sidebar-primary",
  Live: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
}

const dotStyles: Record<ProjectStatus, string> = {
  Draft: "bg-muted-foreground",
  Building: "bg-sidebar-primary",
  Live: "bg-emerald-400",
}

export function ProjectStatusBadge({
  status,
  className,
}: {
  status: ProjectStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        statusStyles[status],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dotStyles[status])} aria-hidden="true" />
      {status}
    </span>
  )
}

export default ProjectStatusBadge
