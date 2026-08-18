"use client"

import { useState } from "react"
import { VoloProjectTypeSelector } from "@/components/volo-project-type-selector"
import { PromptComposer } from "@/components/prompt-composer"
import { SuggestedPrompts } from "@/components/suggested-prompts"
import { RecentProjects } from "@/components/recent-projects"

export function VoloHome() {
  const [prompt, setPrompt] = useState("")

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Subtle ambient glow — quiet, premium, not decorative filler */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,var(--sidebar-primary)/8%,transparent_70%)]"
      />

      <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-4 pt-14 text-center sm:px-6 sm:pt-24 lg:pt-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="size-1.5 rounded-full bg-sidebar-primary" aria-hidden="true" />
          AI software builder
        </span>

        <h1 className="mt-6 text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          What do you want to build?
        </h1>

        <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Describe your idea and VOLО AI will help turn it into software.
        </p>

        {/* Project type selector */}
        <VoloProjectTypeSelector className="mt-10 sm:mt-12" />

        {/* Main AI prompt composer */}
        <PromptComposer className="mt-6 sm:mt-8" value={prompt} onValueChange={setPrompt} />

        {/* Suggested prompts */}
        <SuggestedPrompts className="mt-6" onSelect={setPrompt} />

        {/* Recent projects — visually secondary to the composer */}
        <RecentProjects className="mt-16 pb-20 sm:mt-20" />
      </div>
    </div>
  )
}

export default VoloHome
