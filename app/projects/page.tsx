import { VoloSidebar } from "@/components/volo-sidebar"
import { VoloTopbar } from "@/components/volo-topbar"
import { ProjectsPage } from "@/components/projects-page"

export default function Projects() {
  return (
    <div className="flex min-h-svh bg-background">
      <VoloSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <VoloTopbar />
        <main className="flex flex-1 flex-col" aria-label="Main content">
          <ProjectsPage />
        </main>
      </div>
    </div>
  )
}
