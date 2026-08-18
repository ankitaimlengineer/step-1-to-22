"use client"

import { ChevronDown, Search, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

function WorkspaceSelector() {
  return (
    <button
      type="button"
      className="flex min-w-0 items-center gap-2 rounded-lg px-2.5 py-1.5 text-left outline-none transition-colors hover:bg-sidebar-accent/60 focus-visible:ring-2 focus-visible:ring-sidebar-ring/70"
    >
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-sidebar-primary/20 text-[11px] font-semibold text-sidebar-primary">
        P
      </span>
      <span className="truncate text-sm font-medium text-sidebar-accent-foreground">
        Pro Workspace
      </span>
      <ChevronDown className="size-4 shrink-0 text-sidebar-foreground/50" strokeWidth={2} />
    </button>
  )
}

function Search_() {
  return (
    <>
      {/* Desktop: full search field */}
      <button
        type="button"
        className="hidden items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/30 px-3 py-1.5 text-left outline-none transition-colors hover:bg-sidebar-accent/60 focus-visible:ring-2 focus-visible:ring-sidebar-ring/70 md:flex"
      >
        <Search className="size-4 shrink-0 text-sidebar-foreground/60" strokeWidth={2} />
        <span className="w-40 truncate text-sm text-sidebar-foreground/60">Search...</span>
        <kbd className="ml-2 inline-flex items-center gap-0.5 rounded border border-sidebar-border bg-sidebar px-1.5 py-0.5 text-[10px] font-medium text-sidebar-foreground/60">
          <span className="text-xs leading-none">⌘</span>K
        </kbd>
      </button>

      {/* Tablet/mobile: icon only */}
      <button
        type="button"
        aria-label="Search"
        className="flex size-9 items-center justify-center rounded-lg text-sidebar-foreground/70 outline-none transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring/70 md:hidden"
      >
        <Search className="size-[18px]" strokeWidth={2} />
      </button>
    </>
  )
}

function NotificationBell() {
  return (
    <button
      type="button"
      aria-label="Notifications"
      className="relative flex size-9 items-center justify-center rounded-lg text-sidebar-foreground/70 outline-none transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring/70"
    >
      <Bell className="size-[18px]" strokeWidth={2} />
      <span
        className="absolute right-2 top-2 size-2 rounded-full bg-sidebar-primary ring-2 ring-sidebar"
        aria-hidden="true"
      />
    </button>
  )
}

function UserAvatar() {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 outline-none transition-colors hover:bg-sidebar-accent/60 focus-visible:ring-2 focus-visible:ring-sidebar-ring/70"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/20 text-xs font-semibold text-sidebar-primary">
        AN
      </span>
      <span className="hidden text-sm font-medium text-sidebar-accent-foreground sm:inline">
        Ankit
      </span>
      <ChevronDown className="hidden size-4 shrink-0 text-sidebar-foreground/50 sm:block" strokeWidth={2} />
    </button>
  )
}

export interface VoloTopbarProps {
  className?: string
}

/**
 * VOLO AI — reusable sticky topbar.
 * Matches the sidebar design language and collapses search to an icon on smaller screens.
 */
export function VoloTopbar({ className }: VoloTopbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border bg-sidebar px-4 sm:px-6",
        className,
      )}
    >
      {/* Left: leave room for the mobile sidebar trigger */}
      <div className="w-11 shrink-0 lg:hidden" aria-hidden="true" />
      <WorkspaceSelector />

      {/* Flexible empty space */}
      <div className="flex-1" />

      {/* Right cluster */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Search_ />
        <NotificationBell />
        <div className="mx-1 hidden h-6 w-px bg-sidebar-border sm:block" aria-hidden="true" />
        <UserAvatar />
      </div>
    </header>
  )
}

export default VoloTopbar
