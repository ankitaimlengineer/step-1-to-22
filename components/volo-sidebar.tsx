"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderGit2,
  Sparkles,
  Rocket,
  Boxes,
  BarChart3,
  BookOpen,
  Settings,
  LifeBuoy,
  ChevronsUpDown,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  icon: LucideIcon
  /** Optional route. When present the item navigates and reflects active state. */
  href?: string
  /** Optional trailing badge, e.g. "New" or a count. */
  badge?: string
}

const primaryNav: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard, href: "/" },
  { label: "Projects", icon: FolderGit2, href: "/projects" },
  { label: "AI Builder", icon: Sparkles, badge: "Beta" },
  { label: "Deployments", icon: Rocket },
  { label: "Templates", icon: Boxes },
  { label: "Analytics", icon: BarChart3 },
]

const secondaryNav: NavItem[] = [
  { label: "Documentation", icon: BookOpen },
  { label: "Support", icon: LifeBuoy },
  { label: "Settings", icon: Settings },
]

function BrandMark() {
  return (
    <div className="flex items-center gap-3 px-2">
      <img
        src="/images/volonis-logo.png"
        alt="VOLONIS TECHNOLOGIES logo"
        width={36}
        height={36}
        className="size-9 shrink-0 object-contain"
      />
      <div className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight text-sidebar-accent-foreground">
          VOLО AI
        </span>
        <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-sidebar-foreground/60">
          Volonis Technologies
        </span>
      </div>
    </div>
  )
}

function NavButton({ item, active, onNavigate }: { item: NavItem; active: boolean; onNavigate?: () => void }) {
  const Icon = item.icon

  const className = cn(
    "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium outline-none transition-colors",
    "focus-visible:ring-2 focus-visible:ring-sidebar-ring/70",
    active
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
  )

  const inner = (
    <>
      {active && (
        <span
          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-sidebar-primary"
          aria-hidden="true"
        />
      )}
      <Icon
        className={cn(
          "size-[18px] shrink-0 transition-colors",
          active
            ? "text-sidebar-primary"
            : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground",
        )}
        strokeWidth={2}
      />
      <span className="truncate">{item.label}</span>
      {item.badge && (
        <span className="ml-auto rounded-md bg-sidebar-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sidebar-primary">
          {item.badge}
        </span>
      )}
    </>
  )

  if (item.href) {
    return (
      <Link href={item.href} aria-current={active ? "page" : undefined} onClick={onNavigate} className={className}>
        {inner}
      </Link>
    )
  }

  return (
    <button type="button" aria-current={active ? "page" : undefined} className={className}>
      {inner}
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/45">
      {children}
    </p>
  )
}

function UserCard() {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent/40 px-2.5 py-2 text-left outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring/70"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary/20 text-xs font-semibold text-sidebar-primary">
        AV
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-sm font-medium text-sidebar-accent-foreground">
          Ada Volonis
        </span>
        <span className="truncate text-xs text-sidebar-foreground/60">Pro workspace</span>
      </span>
      <ChevronsUpDown className="ml-auto size-4 shrink-0 text-sidebar-foreground/50" strokeWidth={2} />
    </button>
  )
}

function isItemActive(href: string | undefined, pathname: string): boolean {
  if (!href) return false
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

/** The scrollable inner content, shared between desktop and mobile. */
function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="pt-5">
        <BrandMark />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Primary">
        {primaryNav.map((item) => (
          <NavButton
            key={item.label}
            item={item}
            active={isItemActive(item.href, pathname)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="mx-3 h-px bg-sidebar-border" role="separator" aria-hidden="true" />

      <div className="space-y-1 px-3">
        <SectionLabel>Workspace</SectionLabel>
        {secondaryNav.map((item) => (
          <NavButton
            key={item.label}
            item={item}
            active={isItemActive(item.href, pathname)}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      <div className="px-3 pb-4">
        <UserCard />
      </div>
    </div>
  )
}

export interface VoloSidebarProps {
  className?: string
}

/**
 * VOLO AI — reusable left navigation sidebar.
 * Fixed rail on desktop, slide-over drawer on tablet/mobile.
 */
export function VoloSidebar({ className }: VoloSidebarProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        className={cn(
          "fixed left-4 top-4 z-50 flex size-10 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar text-sidebar-accent-foreground shadow-sm outline-none transition-opacity hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring/70 lg:hidden",
          open && "pointer-events-none opacity-0",
        )}
      >
        <Menu className="size-5" strokeWidth={2} />
      </button>

      {/* Desktop: static sidebar */}
      <aside
        className={cn(
          "hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col",
          className,
        )}
        aria-label="Sidebar"
      >
        <SidebarContent />
      </aside>
      {/* Mobile: overlay + drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 ease-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Sidebar"
        aria-hidden={!open}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close navigation menu"
          className="absolute right-3 top-4 z-10 flex size-8 items-center justify-center rounded-md text-sidebar-foreground/70 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring/70"
        >
          <X className="size-4" strokeWidth={2} />
        </button>
        <SidebarContent onNavigate={() => setOpen(false)} />
      </aside>
    </>
  )
}

export default VoloSidebar
