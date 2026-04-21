import { useNavigate } from "react-router-dom";
import { okrAverage, isOverdue, visibleProjectsForUser } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import type { Project } from "@/types";
import { StatusBadge, RiskBadge } from "./StatusBadge";
import { AlertTriangle, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProjectsTable({ filter }: { filter?: (p: Project) => boolean }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const base = visibleProjectsForUser(user);
  const list = filter ? base.filter(filter) : base;

  return (
    <div className="rounded-lg border border-border bg-surface shadow-elev overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="font-display text-lg font-medium">Projektet shtetërore</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{list.length} projekte · klikoni një rresht për detajet</p>
        </div>
        <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Live · auto-refresh 60s</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="text-left font-medium px-5 py-3">Projekti</th>
              <th className="text-left font-medium px-3 py-3">Ministritë</th>
              <th className="text-left font-medium px-3 py-3">Statusi</th>
              <th className="text-left font-medium px-3 py-3">Faza</th>
              <th className="text-left font-medium px-3 py-3 w-[180px]">Progres</th>
              <th className="text-right font-medium px-3 py-3">OKR %</th>
              <th className="text-left font-medium px-3 py-3">Risk</th>
              <th className="text-left font-medium px-3 py-3">Ekipi</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {list.map(p => {
              const okr = okrAverage(p.okr);
              const overdue = isOverdue(p);
              return (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className="border-b border-border last:border-0 hover:bg-surface-hover cursor-pointer transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-2">
                      {overdue && <AlertTriangle className="size-3.5 text-destructive mt-1 shrink-0 animate-pulse-soft" />}
                      <div>
                        <div className="font-medium text-foreground leading-snug">{p.name}</div>
                        <div className="text-[11px] font-mono text-muted-foreground mt-0.5">{p.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex flex-col gap-0.5 max-w-[220px]">
                      {p.ministries.map(m => (
                        <span key={m} className="text-xs text-muted-foreground leading-tight truncate">{m}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-3 py-4">
                    <div className="font-mono text-sm">
                      <span className="text-foreground">{p.currentPhase}</span>
                      <span className="text-muted-foreground">/{p.totalPhases}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      {new Date(p.startDate).toLocaleDateString("sq-AL", { month: "short", year: "2-digit" })}
                      <span className="mx-1">→</span>
                      {new Date(p.endDate).toLocaleDateString("sq-AL", { month: "short", year: "2-digit" })}
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", p.progress >= 80 ? "bg-success" : p.progress >= 40 ? "bg-primary" : "bg-warning")} style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground w-9 text-right">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-right">
                    <span className={cn("font-mono font-medium", okr >= 85 ? "text-success" : okr >= 70 ? "text-primary" : okr >= 55 ? "text-warning" : "text-destructive")}>
                      {okr}
                    </span>
                  </td>
                  <td className="px-3 py-4"><RiskBadge risk={p.risk} /></td>
                  <td className="px-3 py-4">
                    <div className="flex -space-x-1.5">
                      {p.team.slice(0, 3).map((t, i) => (
                        <div key={i} className="size-6 rounded-full bg-surface-elevated border border-border-strong text-[10px] grid place-items-center text-muted-foreground font-medium" title={t}>
                          {t.split(" ").map(n => n[0]).slice(0,2).join("")}
                        </div>
                      ))}
                      {p.team.length > 3 && (
                        <div className="size-6 rounded-full bg-surface-elevated border border-border-strong text-[10px] grid place-items-center text-muted-foreground">
                          +{p.team.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-accent transition-colors" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
