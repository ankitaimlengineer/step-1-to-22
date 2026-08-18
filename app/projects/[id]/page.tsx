import { VoloSidebar } from "@/components/volo-sidebar"
import { VoloTopbar } from "@/components/volo-topbar"
import { ProjectDetailsPage } from "@/components/project-details-page"

export default async function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="flex min-h-svh bg-background">
      <VoloSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <VoloTopbar />
        <main className="flex flex-1 flex-col" aria-label="Main content">
          <ProjectDetailsPage projectId={id} />
        </main>
      </div>
    </div>
  )
}
