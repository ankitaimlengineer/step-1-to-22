import { resolveProjectIcon, type ProjectStatus, type SampleProject } from "@/lib/sample-projects"

/** localStorage key for persisting VOLO AI projects on this browser/device. */
export const STORAGE_KEY = "volo-ai-projects"

/**
 * Serializable form of a project. The `icon` field on SampleProject is a React
 * component (LucideIcon) and cannot be stored in JSON, so it is omitted here
 * and re-derived from `type` on load via resolveProjectIcon().
 */
type StoredProject = Omit<SampleProject, "icon">

/** True only in a browser with a usable localStorage. Guards SSR + privacy modes. */
function hasLocalStorage(): boolean {
  try {
    return typeof window !== "undefined" && !!window.localStorage
  } catch {
    return false
  }
}

/** Strip the non-serializable icon before persisting. */
function toStored(project: SampleProject): StoredProject {
  const { icon: _icon, ...rest } = project
  return rest
}

/** Re-attach the icon component based on the stored `type` label. */
function fromStored(stored: StoredProject): SampleProject {
  return { ...stored, icon: resolveProjectIcon(stored.type) }
}

/** Basic runtime validation so corrupted entries can't crash the UI. */
function isValidStored(value: unknown): value is StoredProject {
  if (typeof value !== "object" || value === null) return false
  const p = value as Record<string, unknown>
  return (
    typeof p.id === "string" &&
    typeof p.name === "string" &&
    typeof p.type === "string" &&
    typeof p.technology === "string" &&
    typeof p.status === "string"
  )
}

/**
 * Load persisted projects from localStorage.
 * Returns null when nothing is saved, storage is unavailable, or the stored
 * data is invalid/corrupted — callers then fall back to the sample projects.
 */
export function loadProjects(): SampleProject[] | null {
  if (!hasLocalStorage()) return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null

    const valid = parsed.filter(isValidStored)
    if (valid.length === 0) return null

    // De-duplicate by id as a final safety net against corrupted writes.
    const seen = new Set<string>()
    const unique = valid.filter((p) => {
      if (seen.has(p.id)) return false
      seen.add(p.id)
      return true
    })

    return unique.map((p) => fromStored({ ...p, status: p.status as ProjectStatus }))
  } catch {
    // Invalid JSON or any read error — behave as first-time user.
    return null
  }
}

/** Persist the full project list (newest first). No-op if storage is unavailable. */
export function saveProjects(projects: SampleProject[]): void {
  if (!hasLocalStorage()) return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects.map(toStored)))
  } catch {
    // Quota / serialization errors are non-fatal; keep app running in-memory.
  }
}

/** Remove all persisted projects. */
export function clearProjects(): void {
  if (!hasLocalStorage()) return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore — nothing else to do.
  }
}
