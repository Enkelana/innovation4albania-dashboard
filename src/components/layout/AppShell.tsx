import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, KanbanSquare, CalendarDays, LogOut, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, ROLE_LABEL } from "@/context/AuthContext";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/projects", label: "Projektet", icon: FolderKanban },
  { to: "/performance", label: "Performance Board", icon: KanbanSquare },
  { to: "/calendar", label: "Kalendar", icon: CalendarDays },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col">
        <div className="px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-md bg-gradient-accent grid place-items-center shadow-glow">
              <span className="font-display font-bold text-accent-foreground text-sm">i4</span>
            </div>
            <div className="leading-tight">
              <div className="font-display text-[15px] font-semibold tracking-tight">Innovation</div>
              <div className="font-display text-[15px] font-semibold tracking-tight -mt-0.5 text-accent">4Albania</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to} to={to} end={to === "/"}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-elev"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
              )}
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-3">
          <div className="px-3 py-2.5 rounded-md bg-sidebar-accent/40">
            <div className="text-[11px] uppercase tracking-wider text-sidebar-foreground/50">Lidhur si</div>
            <div className="text-sm font-medium text-sidebar-foreground mt-0.5 truncate">{user?.name}</div>
            <div className="text-xs text-accent mt-0.5">{user && ROLE_LABEL[user.role]}</div>
            {user?.ministry && (
              <div className="text-[11px] text-sidebar-foreground/60 mt-1 leading-tight">{user.ministry}</div>
            )}
          </div>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <LogOut className="size-4" />
            Dil
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar / ticker */}
        <header className="h-14 border-b border-border bg-surface/60 backdrop-blur flex items-center justify-between px-6">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="ticker-dot text-success">SISTEMI ONLINE</span>
            <span className="text-border-strong">|</span>
            <span className="font-mono">REPUBLIKA E SHQIPËRISË · KRYEMINISTRIA</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
            <span><Activity className="inline size-3 mr-1 text-accent" />v1.0 · {new Date().toLocaleDateString("sq-AL", { day: "2-digit", month: "short", year: "numeric" })}</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
