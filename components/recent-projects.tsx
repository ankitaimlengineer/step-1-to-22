import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { sampleProjects } from "@/lib/sample-projects"
import { ProjectCard } from "@/components/project-card"

export function RecentProjects({ className }: { className?: string }) {
  return (
    <section aria-labelledby="recent-projects-heading" className={cn("w-full text-left", className)}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="recent-projects-heading" className="text-sm font-semibold text-foreground">
            Recent Projects
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Continue working on your recent projects.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-sidebar-primary focus-visible:text-sidebar-primary"
        >
          View all
          <ArrowRight className="size-3.5" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sampleProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}

export default RecentProjects
