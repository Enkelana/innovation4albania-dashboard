import { ReactNode, useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  CalendarDays,
  ClipboardList,
  FolderKanban,
  KanbanSquare,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldAlert,
  Sun,
  Target,
  UserCircle2,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABEL } from "@/constants/roles";
import AiAssistantWidget from "@/components/ai/AiAssistantWidget";

type SidebarTab = "main" | "profile";

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SidebarTab>("main");

  const isInnovationDirector = user?.role === "drejtor_agjencie" || user?.role === "drejtor_inovacioni_publik";
  const showRiskTab = user?.role !== "kryeminister" && user?.role !== "minister";
  const showCalendarTab = true;
  const navItems = useMemo(
    () => [
      { to: "/", label: "Pamje e përgjithshme", icon: LayoutDashboard },
      { to: "/projects", label: "Projektet", icon: FolderKanban },
      ...(isInnovationDirector ? [{ to: "/portfolio-okr", label: "OKR Portofol", icon: Target }] : []),
      ...(showRiskTab ? [{ to: "/risk-devijime", label: "Risk & Devijime", icon: ShieldAlert }] : []),
      ...(isInnovationDirector || user?.role === "staf_agjencie"
        ? [{ to: "/perditesimet", label: "Përditësimet", icon: ClipboardList }]
        : []),
      { to: "/performance", label: "Tabela e performancës", icon: KanbanSquare },
      ...(showCalendarTab ? [{ to: "/calendar", label: "Kalendari", icon: CalendarDays }] : []),
    ],
    [isInnovationDirector, showRiskTab, showCalendarTab, user?.role],
  );

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarClasses = cn(
    "fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar/95 text-sidebar-foreground backdrop-blur-xl shadow-[0_24px_80px_rgba(15,23,42,0.32)] transition-all duration-500 ease-out lg:sticky lg:top-0",
    sidebarOpen ? "w-[292px]" : "w-[96px]",
    mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
  );

  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      <div
        className={cn(
          "fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside className={sidebarClasses}>
        <div className="relative overflow-hidden border-b border-sidebar-border px-4 py-4">
          <div className="absolute inset-x-4 top-2 h-20 rounded-full bg-accent/12 blur-3xl" />
          <div className={cn("relative flex items-center", sidebarOpen ? "justify-between gap-3" : "justify-center") }>
            <div className={cn("flex items-center gap-3 transition-all duration-300", !sidebarOpen && "justify-center") }>
              <div className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-accent via-sky-500 to-cyan-400 text-accent-foreground shadow-[0_12px_30px_rgba(14,165,233,0.35)] transition-transform duration-300 hover:scale-105">
                <div className="flex items-baseline gap-0.5 font-display font-bold tracking-tight"><span className="text-base leading-none">I</span><span className="text-lg leading-none text-slate-950/85">4</span><span className="text-sm leading-none">A</span></div>
              </div>
              {sidebarOpen && (
                <div className="min-w-0 animate-fade-in">
                  <div className="font-display text-base font-semibold tracking-tight text-sidebar-foreground">Innovation4Albania</div>
                  <div className="mt-0.5 text-xs uppercase tracking-[0.28em] text-sidebar-foreground/55">Control Center</div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="grid size-9 place-items-center rounded-xl border border-sidebar-border bg-white/5 text-sidebar-foreground/80 transition-all duration-300 hover:bg-white/10 hover:text-sidebar-foreground lg:hidden"
                title="Mbyll menunë"
              >
                <X className="size-4" />
              </button>
              <button
                onClick={() => setSidebarOpen((value) => !value)}
                className="hidden lg:grid size-9 place-items-center rounded-xl border border-sidebar-border bg-white/5 text-sidebar-foreground/80 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-sidebar-foreground"
                title={sidebarOpen ? "Ngushto sidebar" : "Zgjero sidebar"}
              >
                {sidebarOpen ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className={cn("grid rounded-2xl border border-white/8 bg-white/[0.04] p-1 shadow-inner transition-all duration-300", sidebarOpen ? "grid-cols-2" : "grid-cols-1") }>
            <button
              onClick={() => setActiveTab("main")}
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-semibold tracking-wide transition-all duration-300",
                activeTab === "main"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[0_10px_24px_rgba(14,165,233,0.25)]"
                  : "text-sidebar-foreground/65 hover:text-sidebar-foreground",
              )}
              title={!sidebarOpen ? "Navigimi" : undefined}
            >
              {sidebarOpen ? "Navigimi" : "N"}
            </button>
            {sidebarOpen && (
              <button
                onClick={() => setActiveTab("profile")}
                className={cn(
                  "rounded-xl px-3 py-2 text-xs font-semibold tracking-wide transition-all duration-300",
                  activeTab === "profile"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[0_10px_24px_rgba(14,165,233,0.25)]"
                    : "text-sidebar-foreground/65 hover:text-sidebar-foreground",
                )}
              >
                Profili
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden px-3 pb-3">
          {activeTab === "main" || !sidebarOpen ? (
            <nav className="h-full overflow-y-auto pr-1">
              <div className={cn("mb-3 px-3 text-[11px] uppercase tracking-[0.28em] text-sidebar-foreground/40", !sidebarOpen && "text-center") }>
                {sidebarOpen ? "Modulet" : "Menu"}
              </div>
              <div className="space-y-1.5">
                {navItems.map(({ to, label, icon: Icon }, idx) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    title={!sidebarOpen ? label : undefined}
                    style={{ animationDelay: `${idx * 45}ms` }}
                    className={({ isActive }) =>
                      cn(
                        "group relative flex items-center overflow-hidden rounded-2xl border px-3 py-3 text-sm font-medium transition-all duration-300 animate-slide-in-left",
                        sidebarOpen ? "gap-3" : "justify-center",
                        isActive
                          ? "border-accent/40 bg-gradient-to-r from-accent/18 via-accent/12 to-transparent text-sidebar-foreground shadow-[0_16px_28px_rgba(14,165,233,0.18)]"
                          : "border-transparent text-sidebar-foreground/72 hover:border-white/10 hover:bg-white/[0.055] hover:text-sidebar-foreground hover:translate-x-1",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className={cn(
                          "grid size-10 shrink-0 place-items-center rounded-xl transition-all duration-300",
                          isActive ? "bg-white/12 text-accent" : "bg-white/[0.06] text-sidebar-foreground/78 group-hover:bg-white/[0.1] group-hover:text-sidebar-foreground",
                        )}>
                          <Icon className="size-4" />
                        </div>
                        {sidebarOpen && (
                          <div className="min-w-0 flex-1">
                            <div className="truncate">{label}</div>
                          </div>
                        )}
                        {isActive && <div className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-accent" />}
                        {!sidebarOpen && (
                          <div className="pointer-events-none absolute left-[84px] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-slate-900/96 px-3 py-2 text-xs text-white opacity-0 shadow-xl transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
                            {label}
                          </div>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </nav>
          ) : (
            <div className="space-y-3 animate-fade-in px-1">
              <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-4 shadow-inner">
                <div className="flex items-start gap-3">
                  <div className="grid size-11 place-items-center rounded-2xl bg-white/10 text-accent shadow-[0_10px_24px_rgba(14,165,233,0.15)]">
                    <UserCircle2 className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-sidebar-foreground">{user?.name}</div>
                    <div className="mt-1 text-xs text-accent">{user ? ROLE_LABEL[user.role] : "Përdorues"}</div>
                    {user?.ministry && <div className="mt-2 text-[11px] leading-relaxed text-sidebar-foreground/55">{user.ministry}</div>}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-4">
                <div className="text-[11px] uppercase tracking-[0.28em] text-sidebar-foreground/40">Seanca</div>
                <div className="mt-3 flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">
                  <span className="inline-flex size-2 rounded-full bg-emerald-300 animate-pulse" />
                  Lidhja aktive dhe funksionale
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-sidebar-border px-3 py-3">
          <div className={cn("rounded-3xl border border-white/10 bg-white/[0.045] p-2", sidebarOpen ? "space-y-2" : "space-y-1") }>
            {sidebarOpen && (
              <div className="px-3 pt-2 text-[11px] uppercase tracking-[0.28em] text-sidebar-foreground/38">Veprime</div>
            )}
            <button
              onClick={handleLogout}
              className={cn(
                "flex w-full items-center rounded-2xl px-3 py-3 text-sm font-medium text-sidebar-foreground/75 transition-all duration-300 hover:bg-white/[0.08] hover:text-sidebar-foreground",
                sidebarOpen ? "gap-3" : "justify-center",
              )}
              title={!sidebarOpen ? "Dil" : undefined}
            >
              <LogOut className="size-4" />
              {sidebarOpen && <span>Dil</span>}
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/75 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="grid size-10 place-items-center rounded-2xl border border-border bg-surface text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent lg:hidden"
                title="Hap menunë"
              >
                <Menu className="size-5" />
              </button>
              <button
                onClick={() => setSidebarOpen((value) => !value)}
                className="hidden lg:grid size-10 place-items-center rounded-2xl border border-border bg-surface text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
                title={sidebarOpen ? "Ngushto sidebar" : "Zgjero sidebar"}
              >
                {sidebarOpen ? <PanelLeftClose className="size-5" /> : <PanelLeftOpen className="size-5" />}
              </button>

              <div>
                <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Panel Ekzekutiv</div>
                <div className="mt-0.5 flex items-center gap-2 text-sm text-foreground">
                  <span className="font-medium">Innovation4Albania</span>
                  <span className="hidden text-muted-foreground sm:inline">·</span>
                  <span className="hidden text-muted-foreground sm:inline">Sistem monitorimi i projekteve</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300 md:flex">
                <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
                Sistemi aktiv
              </div>
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="grid size-10 place-items-center rounded-2xl border border-border bg-surface text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
                title={theme === "light" ? "Modaliteti i errët" : "Modaliteti i dritës"}
              >
                {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
              </button>
              <div className="hidden rounded-2xl border border-border bg-surface px-3 py-2 text-xs text-muted-foreground sm:block">
                <Activity className="mr-1 inline size-3.5 text-accent" />
                {new Date().toLocaleDateString("sq-AL", { day: "2-digit", month: "short", year: "numeric" })}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      <AiAssistantWidget />
    </div>
  );
}

