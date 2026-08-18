import { VoloSidebar } from "@/components/volo-sidebar"
import { VoloTopbar } from "@/components/volo-topbar"
import { VoloHome } from "@/components/volo-home"

export default function Page() {
  return (
    <div className="flex min-h-svh bg-background">
      <VoloSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <VoloTopbar />
        <main className="flex flex-1 flex-col" aria-label="Main content">
          <VoloHome />
        </main>
      </div>
    </div>
  )
}
