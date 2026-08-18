"use client"

import { useState } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { Bot, Globe, Smartphone, X, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ProjectConfiguration } from "@/components/project-configuration"
import { ProjectReview } from "@/components/project-review"
import { useProjects } from "@/components/projects-provider"

type ProjectType = "website" | "mobile" | "ai-system"

type ProjectOption = {
  id: ProjectType
  title: string
  description: string
  icon: LucideIcon
}

const options: ProjectOption[] = [
  {
    id: "website",
    title: "Website",
    description: "Websites, SaaS apps and web applications.",
    icon: Globe,
  },
  {
    id: "mobile",
    title: "Mobile",
    description: "Android and iOS mobile applications.",
    icon: Smartphone,
  },
  {
    id: "ai-system",
    title: "AI System",
    description: "AI agents, automation and intelligent systems.",
    icon: Bot,
  },
]

/**
 * VOLO AI — Create New Project dialog.
 * UI-only modal: choose a project type and name a project. Continue does not
 * persist anything yet — it only holds the UI ready for the next step.
 * Local state only, no backend, no API, no navigation.
 */
export function CreateProjectDialog({ children }: { children: React.ReactNode }) {
  const { createProject } = useProjects()

  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selected, setSelected] = useState<ProjectType>("website")
  const [name, setName] = useState("")

  // Step 2 configuration state, lifted here so Step 3 (Review) can read it and
  // values survive Back / Edit navigation between steps.
  const [description, setDescription] = useState("")
  const [audience, setAudience] = useState("")
  const [features, setFeatures] = useState<string[]>([])
  const [tech, setTech] = useState("Let VOLO AI decide")

  // Validation message shown on the Review step if required data is missing.
  const [createError, setCreateError] = useState<string | null>(null)

  const canContinue = name.trim().length > 0

  function resetForm() {
    setStep(1)
    setSelected("website")
    setName("")
    setDescription("")
    setAudience("")
    setFeatures([])
    setTech("Let VOLO AI decide")
    setCreateError(null)
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    // Reset transient form state whenever the dialog fully closes.
    if (!next) resetForm()
  }

  // Step 3 — actually create the project in shared session state.
  function handleCreate() {
    if (name.trim().length === 0) {
      setStep(1)
      return
    }
    if (description.trim().length === 0) {
      setCreateError("Add a project description before creating this project.")
      return
    }

    createProject({
      name,
      type: selected,
      description,
      targetAudience: audience,
      features,
      technology: tech,
    })

    // Close the dialog (Projects grid already shows the new project) and
    // reset the form so the next project starts clean.
    setOpen(false)
    resetForm()
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger render={children as React.ReactElement} />

      <Dialog.Portal>
        <Dialog.Backdrop
          className={cn(
            "fixed inset-0 z-50 bg-background/70 backdrop-blur-sm",
            "transition-opacity duration-200",
            "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
          )}
        />

        <Dialog.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)]",
            step === 1 ? "max-w-[560px]" : "max-w-[680px]",
            "max-h-[calc(100svh-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto",
            "rounded-2xl border border-border bg-card text-card-foreground",
            "p-5 shadow-2xl shadow-black/40 outline-none sm:p-6",
            "transition-all duration-200 ease-out",
            "data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0",
            "data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0",
          )}
        >
          {/* Close — always available on both steps */}
          <Dialog.Close
            className={cn(
              "absolute right-4 top-4 z-10 flex size-8 shrink-0 items-center justify-center rounded-lg border border-transparent text-muted-foreground outline-none transition-colors sm:right-5 sm:top-5",
              "hover:bg-muted hover:text-foreground",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            )}
            aria-label="Close dialog"
          >
            <X className="size-4" strokeWidth={2} aria-hidden="true" />
          </Dialog.Close>

          {step === 3 ? (
            <ProjectReview
              projectType={selected}
              projectName={name.trim()}
              description={description}
              audience={audience}
              features={features}
              tech={tech}
              error={createError}
              onEditDetails={() => {
                setCreateError(null)
                setStep(1)
              }}
              onEditConfigure={() => {
                setCreateError(null)
                setStep(2)
              }}
              onBack={() => {
                setCreateError(null)
                setStep(2)
              }}
              onCreate={handleCreate}
            />
          ) : step === 2 ? (
            <ProjectConfiguration
              projectType={selected}
              projectName={name.trim()}
              description={description}
              audience={audience}
              features={features}
              tech={tech}
              onDescriptionChange={setDescription}
              onAudienceChange={setAudience}
              onFeaturesChange={setFeatures}
              onTechChange={setTech}
              onBack={() => setStep(1)}
              onContinue={() => setStep(3)}
            />
          ) : (
            <>
              {/* Header */}
              <div className="pr-10">
                <Dialog.Title className="text-lg font-semibold tracking-tight text-foreground">
                  Create New Project
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                  Choose what you want to build with VOLO AI.
                </Dialog.Description>
              </div>

              {/* Project type selection */}
              <div
                role="radiogroup"
                aria-label="Project type"
                className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3"
              >
                {options.map(({ id, title, description, icon: Icon }) => {
              const isSelected = selected === id
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelected(id)}
                  className={cn(
                    "group relative flex flex-col rounded-xl border p-3.5 text-left outline-none transition-all duration-200",
                    "focus-visible:ring-2 focus-visible:ring-sidebar-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                    isSelected
                      ? "border-sidebar-primary/60 bg-sidebar-primary/[0.07]"
                      : "border-border bg-card/40 hover:border-border/80 hover:bg-card/70",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg border transition-colors",
                        isSelected
                          ? "border-sidebar-primary/40 bg-sidebar-primary/15 text-sidebar-primary"
                          : "border-border bg-background/60 text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      <Icon className="size-[18px]" strokeWidth={2} aria-hidden="true" />
                    </span>

                    {isSelected ? (
                      <span
                        className="size-2 rounded-full bg-sidebar-primary"
                        aria-hidden="true"
                      />
                    ) : null}
                  </div>

                  <h3
                    className={cn(
                      "mt-3 text-sm font-semibold tracking-tight",
                      isSelected ? "text-foreground" : "text-foreground/90",
                    )}
                  >
                    {title}
                  </h3>
                  <p className="mt-1 text-pretty text-[13px] leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Project name */}
          <div className="mt-5">
            <label
              htmlFor="volo-project-name"
              className="text-sm font-medium text-foreground"
            >
              Project name
            </label>
            <input
              id="volo-project-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Customer Support AI"
              autoComplete="off"
              className={cn(
                "mt-2 h-10 w-full rounded-lg border border-border bg-background/60 px-3 text-sm text-foreground outline-none transition-colors",
                "placeholder:text-muted-foreground/70",
                "hover:border-border/80",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              )}
            />
          </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Dialog.Close render={<Button variant="outline" className="h-10 sm:w-auto" />}>
                  Cancel
                </Dialog.Close>
                <Button
                  type="button"
                  disabled={!canContinue}
                  onClick={() => setStep(2)}
                  className="h-10 bg-sidebar-primary text-sidebar-primary-foreground transition-colors hover:bg-sidebar-primary/90 active:bg-sidebar-primary/80 sm:w-auto"
                >
                  Continue
                </Button>
              </div>
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default CreateProjectDialog
