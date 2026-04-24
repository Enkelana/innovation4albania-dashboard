import { useNavigate } from "react-router-dom";
import type { Project } from "@/types";
import { StatusBadge, RiskBadge } from "./StatusBadge";
import { AlertTriangle, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectsTableProps {
  projects?: Project[];
  isLoading?: boolean;
}

export default function ProjectsTable({ projects = [], isLoading = false }: ProjectsTableProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-border bg-surface shadow-elev overflow-hidden animate-scale-in">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="font-display text-lg font-medium">Projektet shtetërore</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{projects.length} projekte · klikoni një rresht për detajet</p>
        </div>
        <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Filtrim aktiv · të sinkronizuara me backend-in</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="text-left font-medium px-5 py-3">Projekti</th>
              <th className="text-left font-medium px-3 py-3">Statusi</th>
              <th className="text-left font-medium px-3 py-3">Ministritë</th>
              <th className="text-left font-medium px-3 py-3">Progresi</th>
              <th className="text-left font-medium px-3 py-3">Ditë</th>
              <th className="text-right font-medium px-3 py-3">OKR</th>
              <th className="text-left font-medium px-3 py-3">Risku</th>
              <th className="text-left font-medium px-3 py-3">Ekipi</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={9} className="px-5 py-10 text-center text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="size-2 bg-accent rounded-full animate-bounce-gentle"></div>
                    <span>Duke ngarkuar projektet...</span>
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && projects.length === 0 && (
              <tr>
                <td colSpan={9} className="px-5 py-10 text-center text-sm text-muted-foreground animate-fade-in">Nuk u gjet asnjë projekt.</td>
              </tr>
            )}
            {!isLoading && projects.map((p, index) => (
              <tr
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                className="border-b border-border last:border-0 hover:bg-surface-hover cursor-pointer transition-colors group animate-slide-in-up hover:translate-x-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-5 py-4">
                  <div className="flex items-start gap-2">
                    {(p.isOverdue || p.delayDays > 0) && <AlertTriangle className="size-3.5 text-destructive mt-1 shrink-0 animate-pulse-soft" />}
                    <div>
                      <div className="font-medium text-foreground leading-snug group-hover:text-accent transition-colors">{p.name}</div>
                      <div className="text-[11px] font-mono text-muted-foreground mt-0.5 opacity-75 group-hover:opacity-100 transition-opacity">{p.code}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4"><StatusBadge status={p.status} /></td>
                <td className="px-3 py-4">
                  <div className="flex flex-col gap-0.5 max-w-[220px]">
                    {p.ministries.map((m) => (
                      <span key={m} className="text-xs text-muted-foreground leading-tight truncate hover:text-foreground transition-colors">{m}</span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-4 min-w-[180px]">
                  <div className="text-[11px] font-mono text-muted-foreground mb-1">{p.progress}% aktual · {p.expectedProgress}% i pritur</div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden group-hover:shadow-elev transition-shadow">
                      <div className={cn("h-full rounded-full transition-all duration-300", p.progress >= p.expectedProgress ? "bg-success" : p.deviationPercent > 10 ? "bg-destructive" : "bg-warning")} style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground w-9 text-right group-hover:text-accent transition-colors">{p.progress}%</span>
                  </div>
                </td>

                <td className="px-3 py-4">
                  <div className="text-xs font-mono text-muted-foreground group-hover:text-accent transition-colors">{p.daysRemaining} ditë mbetur</div>
                  <div className={cn("text-xs font-mono mt-1 font-medium", p.delayDays > 0 ? "text-destructive animate-pulse-ring" : "text-success")}>
                    {p.delayDays > 0 ? `${p.delayDays} ditë vonesë` : "Pa vonesë"}
                  </div>
                </td>
                <td className="px-3 py-4 text-right">
                  <span className={cn("font-mono font-medium group-hover:scale-110 transition-transform origin-right", p.okrAverage >= 85 ? "text-success" : p.okrAverage >= 70 ? "text-primary" : p.okrAverage >= 55 ? "text-warning" : "text-destructive")}>{p.okrAverage}%</span>
                </td>
                <td className="px-3 py-4"><RiskBadge risk={p.risk} /></td>
                <td className="px-3 py-4">
                  <div className="flex -space-x-1.5 group-hover:gap-1 transition-all">
                    {p.team.slice(0, 3).map((t, i) => (
                      <div key={i} className="size-6 rounded-full bg-surface-elevated border border-border-strong text-[10px] grid place-items-center text-muted-foreground font-medium hover:scale-110 transition-transform hover:z-10 cursor-pointer" title={t}>
                        {t.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                    ))}
                    {p.team.length > 3 && <div className="size-6 rounded-full bg-surface-elevated border border-border-strong text-[10px] grid place-items-center text-muted-foreground hover:scale-110 transition-transform">+{p.team.length - 3}</div>}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

