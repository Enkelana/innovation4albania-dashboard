import { cn } from "@/lib/utils";
import type { ProjectStatus, RiskLevel } from "@/types";

const statusAliases: Record<string, ProjectStatus> = {
  procurement: "active",
  in_progress: "active",
};

const statusConf: Record<ProjectStatus, { label: string; cls: string }> = {
  planning: { label: "Planifikim", cls: "bg-warning/15 text-warning border-warning/30" },
  active: { label: "Aktive", cls: "bg-destructive/15 text-destructive border-destructive/30" },
  at_risk: { label: "Në risk", cls: "bg-destructive/15 text-destructive border-destructive/30" },
  blocked: { label: "Pauzë", cls: "bg-muted text-muted-foreground border-border" },
  completed: { label: "Përfunduara", cls: "bg-success/15 text-success border-success/30" },
  cancelled: { label: "Të anuluara", cls: "bg-muted text-muted-foreground border-border" },
};

export function StatusBadge({ status }: { status: ProjectStatus | string }) {
  const normalized = statusAliases[status] ?? status;
  const c = statusConf[normalized as ProjectStatus] ?? statusConf.active;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11px] font-medium font-mono uppercase tracking-wider transition-all hover:scale-110 hover:shadow-glow animate-scale-in", c.cls)}>
      <span className="size-1.5 rounded-full bg-current animate-pulse-soft" />
      {c.label}
    </span>
  );
}

const riskConf: Record<RiskLevel, { label: string; cls: string }> = {
  low: { label: "I ulët", cls: "text-success" },
  medium: { label: "Mesatar", cls: "text-warning" },
  high: { label: "I lartë", cls: "text-destructive" },
  critical: { label: "Kritik", cls: "text-destructive font-semibold animate-pulse-ring" },
};

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const c = riskConf[risk];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider transition-all hover:scale-110 animate-scale-in", c.cls)}>
      <span className="size-1.5 rounded-full bg-current" />
      {c.label}
    </span>
  );
}


