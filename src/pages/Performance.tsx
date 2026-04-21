import { okrAverage, performanceBucket, visibleProjectsForUser } from "@/data/mock";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { RiskBadge } from "@/components/dashboard/StatusBadge";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

const COLS = [
  { key: "excellent",        label: "Shkëlqyeshëm",   hint: "≥ 85",   accent: "text-success", border: "border-success/40", glow: "bg-success/10" },
  { key: "good",             label: "Mirë",           hint: "70 – 84", accent: "text-primary", border: "border-primary/40", glow: "bg-primary/10" },
  { key: "needs_attention",  label: "Kërkon vëmendje", hint: "55 – 69", accent: "text-warning", border: "border-warning/40", glow: "bg-warning/10" },
  { key: "critical",         label: "Kritik",         hint: "< 55",   accent: "text-destructive", border: "border-destructive/40", glow: "bg-destructive/10" },
] as const;

export default function Performance() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const projects = visibleProjectsForUser(user);
  const grouped = COLS.map(c => ({
    ...c,
    items: projects.map(p => ({ p, score: okrAverage(p.okr) }))
                   .filter(({ score }) => performanceBucket(score) === c.key)
                   .sort((a, b) => b.score - a.score),
  }));

  return (
    <div className="p-6 lg:p-8 space-y-5 max-w-[1500px] mx-auto">
      <div>
        <div className="text-[11px] tracking-[0.25em] text-accent uppercase font-mono">Tabela e performancës</div>
        <h1 className="font-display text-3xl font-medium mt-1">Klasifikimi sipas OKR-së</h1>
        <p className="text-muted-foreground text-sm mt-1">Çdo projekt klasifikohet automatikisht sipas mesatares së 5 indikatorëve.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {grouped.map(col => (
          <div key={col.key} className={cn("rounded-lg border bg-surface shadow-elev overflow-hidden", col.border)}>
            <div className={cn("px-4 py-3 border-b flex items-baseline justify-between", col.border, col.glow)}>
              <div>
                <div className={cn("font-display text-base font-medium", col.accent)}>{col.label}</div>
                <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">{col.hint}</div>
              </div>
              <div className={cn("font-mono text-2xl font-medium", col.accent)}>{col.items.length}</div>
            </div>
            <div className="p-3 space-y-2 min-h-[300px]">
              {col.items.length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-8">— Asnjë projekt —</div>
              )}
              {col.items.map(({ p, score }) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className="group w-full text-left p-3 rounded-md bg-surface-elevated border border-border hover:border-border-strong hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-[11px] font-mono text-muted-foreground">{p.code}</div>
                    <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                  <div className="text-sm font-medium leading-snug mt-1 line-clamp-2">{p.name}</div>
                  <div className="flex items-center justify-between mt-3">
                    <RiskBadge risk={p.risk} />
                    <div className={cn("font-mono font-semibold text-lg", col.accent)}>{score}</div>
                  </div>
                  <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
                    <div className={cn("h-full rounded-full", col.accent.replace("text-", "bg-"))} style={{ width: `${p.progress}%` }} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
