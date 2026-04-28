import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { RiskBadge } from "@/components/dashboard/StatusBadge";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { usePerformanceBoard } from "@/hooks/use-dashboard-api";

const labels: Record<string, string> = {
  excellent: "Në nivelin e duhur",
  good: "Mirë",
  needs_attention: "Kërkon vëmendje",
  completed: "Përfunduara",
};

const hints: Record<string, string> = {
  excellent: ">= 85",
  good: "70 - 84",
  needs_attention: "55 - 69",
  completed: "Statusi: Përfunduara",
};

export default function Performance() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: columns = [] } = usePerformanceBoard(user);

  return (
    <div className="p-6 lg:p-8 space-y-5 max-w-[1500px] mx-auto animate-fade-in">
      <div>
        <div className="text-[11px] tracking-[0.25em] text-accent uppercase font-mono">Tabela e performancës</div>
        <h1 className="font-display text-3xl font-medium mt-1">Klasifikimi sipas OKR-së</h1>
        <p className="text-muted-foreground text-sm mt-1">Çdo projekt klasifikohet automatikisht sipas mesatares së indikatorëve dhe statusit të përfundimit.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const tone = col.key === "excellent"
            ? "success"
            : col.key === "good"
              ? "primary"
              : col.key === "needs_attention"
                ? "warning"
                : "success";

          return (
            <div key={col.key} className={cn("rounded-lg border bg-surface shadow-elev overflow-hidden animate-scale-in hover:shadow-glow transition-all duration-300", tone === "success" ? "border-success/40" : tone === "primary" ? "border-primary/40" : "border-warning/40")}>
              <div className={cn("px-4 py-3 border-b flex items-baseline justify-between", tone === "success" ? "border-success/40 bg-success/10" : tone === "primary" ? "border-primary/40 bg-primary/10" : "border-warning/40 bg-warning/10")}>
                <div>
                  <div className={cn("font-display text-base font-medium", tone === "success" ? "text-success" : tone === "primary" ? "text-primary" : "text-warning")}>{labels[col.key] ?? col.label}</div>
                  <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">{hints[col.key] ?? col.hint}</div>
                </div>
                <div className={cn("font-mono text-2xl font-medium", tone === "success" ? "text-success" : tone === "primary" ? "text-primary" : "text-warning")}>{col.items.length}</div>
              </div>
              <div className="p-3 space-y-2 min-h-[300px]">
                {col.items.length === 0 && <div className="text-xs text-muted-foreground text-center py-8">— Asnjë projekt —</div>}
                {col.items.map((item) => (
                  <button key={item.projectId} onClick={() => navigate(`/projects/${item.projectId}`)} className="group w-full text-left p-3 rounded-md bg-surface-elevated border border-border hover:border-border-strong hover:bg-surface-hover transition-all duration-300 hover:-translate-y-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-[11px] font-mono text-muted-foreground">{item.code}</div>
                      <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
                    </div>
                    <div className="text-sm font-medium leading-snug mt-1 line-clamp-2">{item.name}</div>
                    <div className="flex items-center justify-between mt-3">
                      <RiskBadge risk={item.risk} />
                      <div className={cn("font-mono font-semibold text-lg", tone === "success" ? "text-success" : tone === "primary" ? "text-primary" : "text-warning")}>{item.score}</div>
                    </div>
                    <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
                      <div className={cn("h-full rounded-full", tone === "success" ? "bg-success" : tone === "primary" ? "bg-primary" : "bg-warning")} style={{ width: `${item.progress}%` }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

