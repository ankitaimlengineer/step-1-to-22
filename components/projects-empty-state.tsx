import { FolderPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function ProjectsEmptyState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground">
        <FolderPlus className="size-5" strokeWidth={2} />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-foreground">No projects yet</h3>
      <p className="mt-1 max-w-xs text-pretty text-xs leading-relaxed text-muted-foreground">
        Your created projects will appear here.
      </p>
      <Button className="mt-5 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
        Create your first project
      </Button>
    </div>
  )
}

export default ProjectsEmptyState
