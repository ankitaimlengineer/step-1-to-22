"use client"

import { useEffect, useRef, useState } from "react"
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Hammer,
  History,
  Loader2,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { resolveProjectIcon, type SampleProject } from "@/lib/sample-projects"

type BuildState = "idle" | "building" | "completed"

type BuildStatus = "completed" | "failed"

/** A single simulated build recorded in this session's history. */
type BuildEntry = {
  id: string
  number: number
  status: BuildStatus
  createdAt: number
  type: string
  project: string
  summary: string
  durationMs: number
}

/** Format a timestamp as a short relative label ("just now", "3 min ago"). */
function formatRelativeTime(from: number, now: number): string {
  const seconds = Math.max(0, Math.floor((now - from) / 1000))
  if (seconds < 45) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? "" : "s"} ago`
}

/** Format a duration in ms as a compact "1.8s" style label. */
function formatDuration(ms: number): string {
  return `${(ms / 1000).toFixed(1)}s`
}

/**
 * VOLO AI — Project Build workspace (Step 22).
 *
 * Functional-only Build tab content. Lets the user describe what to build
 * next and simulates a local build lifecycle (idle → building → completed).
 * No real AI API, backend, database, or deployment service is involved —
 * the process is entirely client-side and simulated.
 */
export function ProjectBuild({ project }: { project: SampleProject }) {
  const TypeIcon = resolveProjectIcon(project.type)

  const [prompt, setPrompt] = useState("")
  const [state, setState] = useState<BuildState>("idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(false)
  const [builds, setBuilds] = useState<BuildEntry[]>([])
  const [now, setNow] = useState(() => Date.now())

  // Clean up any pending simulation timers on unmount.
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout)
    }
  }, [])

  // Keep relative timestamps fresh while builds exist.
  useEffect(() => {
    if (builds.length === 0) return
    const interval = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(interval)
  }, [builds.length])

  function startBuild() {
    // Validate that the prompt isn't empty before starting.
    if (prompt.trim().length === 0) {
      setError(true)
      return
    }

    setError(false)
    setState("building")
    setProgress(8)

    const startedAt = Date.now()

    // Simulate incremental progress, then mark the build ready.
    const steps = [
      { at: 400, value: 32 },
      { at: 900, value: 58 },
      { at: 1400, value: 81 },
      { at: 1900, value: 96 },
    ]
    steps.forEach((step) => {
      timers.current.push(setTimeout(() => setProgress(step.value), step.at))
    })
    timers.current.push(
      setTimeout(() => {
        setProgress(100)
        setState("completed")
        const finishedAt = Date.now()
        // Record the successful build in this session's history.
        setBuilds((prev) => [
          {
            id: `${finishedAt}-${prev.length + 1}`,
            number: prev.length + 1,
            status: "completed",
            createdAt: finishedAt,
            type: project.type,
            project: project.name,
            summary: prompt.trim(),
            durationMs: finishedAt - startedAt,
          },
          ...prev,
        ])
        setNow(finishedAt)
      }, 2300),
    )
  }

  function resetBuild() {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setState("idle")
    setProgress(0)
  }

  const isBuilding = state === "building"
  const latestBuild = builds[0] ?? null

  return (
    <div className="mt-8">
      {/* Section intro */}
      <div className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 text-sidebar-primary">
          <Hammer className="size-4" strokeWidth={2} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-balance text-xl font-semibold tracking-tight text-foreground">Build your project</h2>
          <p className="mt-1 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
            Describe what you want to build next. VOLO uses your project configuration to shape the result.
          </p>
        </div>
      </div>

      {/* Two-column on desktop, single-column on mobile */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Left — prompt + action */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-border bg-card/60 p-4 sm:p-5">
            {/* Project summary */}
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-sidebar-primary">
                <TypeIcon className="size-4" strokeWidth={2} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{project.name}</p>
                <p className="truncate text-xs text-muted-foreground">{project.type}</p>
              </div>
            </div>

            {/* Prompt input */}
            <label htmlFor="build-prompt" className="mt-4 block text-sm font-medium text-foreground">
              What should we build?
            </label>
            <textarea
              id="build-prompt"
              value={prompt}
              onChange={(event) => {
                setPrompt(event.target.value)
                if (error) setError(false)
              }}
              disabled={isBuilding}
              rows={6}
              placeholder="e.g. Add a customer onboarding flow with email verification and a welcome dashboard."
              aria-invalid={error}
              className={cn(
                "mt-2 w-full resize-y rounded-lg border bg-background/60 px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-sidebar-ring/70 disabled:cursor-not-allowed disabled:opacity-60",
                error ? "border-destructive/70" : "border-border",
              )}
            />
            {error ? (
              <p className="mt-2 text-xs font-medium text-destructive">
                Please describe what you&apos;d like to build before starting.
              </p>
            ) : null}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={startBuild}
                disabled={isBuilding}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-sidebar-primary px-4 text-sm font-medium text-sidebar-primary-foreground outline-none transition-colors hover:bg-sidebar-primary/90 focus-visible:ring-2 focus-visible:ring-sidebar-ring/70 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isBuilding ? (
                  <>
                    <Loader2 className="size-4 animate-spin" strokeWidth={2.25} aria-hidden="true" />
                    Building…
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" strokeWidth={2.25} aria-hidden="true" />
                    Start Build
                  </>
                )}
              </button>
              <p className="text-xs leading-relaxed text-muted-foreground">
                This build is based on your project configuration.
              </p>
            </div>
          </div>
        </div>

        {/* Right — build state */}
        <div className="lg:col-span-2">
          <div className="flex h-full flex-col rounded-xl border border-border bg-card/60 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Build status</h3>
              <BuildStatusPill state={state} />
            </div>

            <div className="mt-4 flex flex-1 flex-col justify-center">
              {state === "idle" ? (
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <span className="flex size-11 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground">
                    <Hammer className="size-5" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <p className="text-sm font-medium text-foreground">Ready to build</p>
                  <p className="max-w-[15rem] text-pretty text-xs leading-relaxed text-muted-foreground">
                    Enter a prompt and start a build to see progress here.
                  </p>
                </div>
              ) : null}

              {state === "building" ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <span className="flex size-11 items-center justify-center rounded-full border border-sidebar-primary/40 bg-sidebar-primary/10 text-sidebar-primary">
                    <Loader2 className="size-5 animate-spin" strokeWidth={2.25} aria-hidden="true" />
                  </span>
                  <p className="text-sm font-medium text-foreground">Building your project…</p>
                  <div
                    className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted/50"
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full bg-sidebar-primary transition-[width] duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{progress}%</p>
                </div>
              ) : null}

              {state === "completed" ? (
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <span className="flex size-11 items-center justify-center rounded-full border border-sidebar-primary/40 bg-sidebar-primary/10 text-sidebar-primary">
                    <CheckCircle2 className="size-5" strokeWidth={2.25} aria-hidden="true" />
                  </span>
                  <p className="text-sm font-medium text-foreground">Build ready</p>
                  <p className="max-w-[15rem] text-pretty text-xs leading-relaxed text-muted-foreground">
                    Your simulated build finished successfully.
                  </p>
                  <button
                    type="button"
                    onClick={resetBuild}
                    className="mt-2 inline-flex h-9 items-center justify-center rounded-md border border-border bg-background/60 px-3 text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-sidebar-ring/70"
                  >
                    Start a new build
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Build Result card */}
      <BuildResultCard state={state} build={latestBuild} now={now} />

      {/* Build History */}
      <BuildHistory builds={builds} now={now} />
    </div>
  )
}

/**
 * Premium result card summarizing the most recent build. Shows a clean
 * placeholder until the first simulated build completes.
 */
function BuildResultCard({
  state,
  build,
  now,
}: {
  state: BuildState
  build: BuildEntry | null
  now: number
}) {
  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold tracking-tight text-foreground">Build result</h2>

      <div className="mt-3 rounded-xl border border-border bg-card/60 p-4 sm:p-5">
        {/* Empty placeholder — before any build completes */}
        {!build ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <span className="flex size-11 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground">
              {state === "building" ? (
                <Loader2 className="size-5 animate-spin" strokeWidth={2.25} aria-hidden="true" />
              ) : (
                <Sparkles className="size-5" strokeWidth={2} aria-hidden="true" />
              )}
            </span>
            <p className="text-sm font-medium text-foreground">
              {state === "building" ? "Preparing your build result…" : "No build result yet"}
            </p>
            <p className="max-w-sm text-pretty text-xs leading-relaxed text-muted-foreground">
              {state === "building"
                ? "Your result summary will appear here once the build finishes."
                : "Start a build to generate a result summary you can open and review."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Header: status + relative time + actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-lg border",
                    build.status === "completed"
                      ? "border-sidebar-primary/40 bg-sidebar-primary/10 text-sidebar-primary"
                      : "border-destructive/40 bg-destructive/10 text-destructive",
                  )}
                >
                  {build.status === "completed" ? (
                    <CheckCircle2 className="size-5" strokeWidth={2.25} aria-hidden="true" />
                  ) : (
                    <AlertTriangle className="size-5" strokeWidth={2.25} aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                        build.status === "completed"
                          ? "border-sidebar-primary/40 bg-sidebar-primary/10 text-sidebar-primary"
                          : "border-destructive/40 bg-destructive/10 text-destructive",
                      )}
                    >
                      {build.status === "completed" ? "Build ready" : "Build failed"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" strokeWidth={2} aria-hidden="true" />
                      Created {formatRelativeTime(build.createdAt, now)}
                    </span>
                  </div>
                  <p className="mt-2 truncate text-base font-semibold text-foreground">{build.project}</p>
                  <p className="mt-1 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
                    {build.summary}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-sidebar-primary px-3.5 text-sm font-medium text-sidebar-primary-foreground outline-none transition-colors hover:bg-sidebar-primary/90 focus-visible:ring-2 focus-visible:ring-sidebar-ring/70"
                >
                  <ExternalLink className="size-4" strokeWidth={2.25} aria-hidden="true" />
                  Open Build
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-border bg-background/60 px-3.5 text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-sidebar-ring/70"
                >
                  View Details
                </button>
              </div>
            </div>

            {/* Build summary grid */}
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
              <SummaryCell label="Project" value={build.project} />
              <SummaryCell label="Type" value={build.type} />
              <SummaryCell
                label="Status"
                value={build.status === "completed" ? "Ready" : "Failed"}
                accent={build.status === "completed" ? "primary" : "destructive"}
              />
              <SummaryCell label="Build time" value={formatDuration(build.durationMs)} />
            </dl>
          </div>
        )}
      </div>
    </section>
  )
}

/** A single labeled cell inside the build summary grid. */
function SummaryCell({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: "primary" | "destructive"
}) {
  return (
    <div className="bg-card p-3">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "mt-1 truncate text-sm font-medium",
          accent === "primary"
            ? "text-sidebar-primary"
            : accent === "destructive"
              ? "text-destructive"
              : "text-foreground",
        )}
      >
        {value}
      </dd>
    </div>
  )
}

/** Session-local list of every simulated build, newest first. */
function BuildHistory({ builds, now }: { builds: BuildEntry[]; now: number }) {
  return (
    <section className="mt-8">
      <div className="flex items-center gap-2">
        <History className="size-4 text-muted-foreground" strokeWidth={2} aria-hidden="true" />
        <h2 className="text-sm font-semibold tracking-tight text-foreground">Build History</h2>
        {builds.length > 0 ? (
          <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {builds.length}
          </span>
        ) : null}
      </div>

      <div className="mt-3 rounded-xl border border-border bg-card/60 p-2 sm:p-3">
        {builds.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <span className="flex size-11 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground">
              <History className="size-5" strokeWidth={2} aria-hidden="true" />
            </span>
            <p className="text-sm font-medium text-foreground">No builds yet</p>
            <p className="max-w-sm text-pretty text-xs leading-relaxed text-muted-foreground">
              Your completed builds will be listed here for the current session.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {builds.map((build) => (
              <li
                key={build.id}
                className="flex flex-col gap-3 rounded-lg border border-border bg-background/40 p-3 transition-colors hover:border-sidebar-primary/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex size-2.5 shrink-0 rounded-full",
                      build.status === "completed" ? "bg-sidebar-primary" : "bg-destructive",
                    )}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="text-sm font-medium text-foreground">Build #{build.number}</p>
                      <span className="text-muted-foreground/50" aria-hidden="true">
                        ·
                      </span>
                      <p className="truncate text-sm text-muted-foreground">{build.project}</p>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" strokeWidth={2} aria-hidden="true" />
                        {formatRelativeTime(build.createdAt, now)}
                      </span>
                      <span className="text-muted-foreground/40" aria-hidden="true">
                        ·
                      </span>
                      <span className="inline-flex items-center rounded border border-border bg-muted/40 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {build.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-5 sm:pl-0">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                      build.status === "completed"
                        ? "border-sidebar-primary/40 bg-sidebar-primary/10 text-sidebar-primary"
                        : "border-destructive/40 bg-destructive/10 text-destructive",
                    )}
                  >
                    {build.status === "completed" ? "Ready" : "Failed"}
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-muted-foreground/60"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

/** Small status pill that mirrors the current build state. */
function BuildStatusPill({ state }: { state: BuildState }) {
  const config: Record<BuildState, { label: string; className: string }> = {
    idle: { label: "Idle", className: "border-border bg-muted/40 text-muted-foreground" },
    building: {
      label: "Building",
      className: "border-sidebar-primary/40 bg-sidebar-primary/10 text-sidebar-primary",
    },
    completed: {
      label: "Ready",
      className: "border-sidebar-primary/40 bg-sidebar-primary/10 text-sidebar-primary",
    },
  }
  const { label, className } = config[state]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        className,
      )}
    >
      {label}
    </span>
  )
}

export default ProjectBuild
