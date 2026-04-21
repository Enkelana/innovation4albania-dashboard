import { cn } from "@/lib/utils";
import type { ProjectStatus, RiskLevel } from "@/types";

const statusConf: Record<ProjectStatus, { label: string; cls: string }> = {
  active:        { label: "Aktiv",       cls: "bg-info/15 text-info border-info/30" },
  in_progress:   { label: "Në proces",   cls: "bg-primary/15 text-primary border-primary/30" },
  completed:     { label: "Përfunduar",  cls: "bg-success/15 text-success border-success/30" },
  cancelled:     { label: "Anuluar",     cls: "bg-muted text-muted-foreground border-border" },
  at_risk:       { label: "Me risk",     cls: "bg-destructive/15 text-destructive border-destructive/30" },
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const c = statusConf[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11px] font-medium font-mono uppercase tracking-wider", c.cls)}>
      <span className="size-1.5 rounded-full bg-current animate-pulse-soft" />
      {c.label}
    </span>
  );
}

const riskConf: Record<RiskLevel, { label: string; cls: string }> = {
  low:      { label: "I ulët",   cls: "text-success" },
  medium:   { label: "Mesatar",  cls: "text-warning" },
  high:     { label: "I lartë",  cls: "text-destructive" },
  critical: { label: "Kritik",   cls: "text-destructive font-semibold" },
};

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const c = riskConf[risk];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider", c.cls)}>
      <span className="size-1.5 rounded-full bg-current" />
      {c.label}
    </span>
  );
}
