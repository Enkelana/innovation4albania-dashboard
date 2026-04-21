import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger" | "accent";
  trend?: { value: string; up?: boolean };
}

const toneClasses: Record<string, string> = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
  accent: "text-accent",
};

export default function StatCard({ label, value, sub, icon: Icon, tone = "default", trend }: Props) {
  return (
    <div className="group relative rounded-lg border border-border bg-surface p-5 shadow-elev hover:border-border-strong transition-colors animate-fade-up">
      <div className="flex items-start justify-between">
        <div className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">{label}</div>
        <Icon className={cn("size-4", toneClasses[tone], "opacity-80")} />
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <div className={cn("font-display text-3xl font-medium tabular", toneClasses[tone])}>{value}</div>
        {trend && (
          <div className={cn("text-xs font-mono", trend.up ? "text-success" : "text-destructive")}>
            {trend.up ? "▲" : "▼"} {trend.value}
          </div>
        )}
      </div>
      {sub && <div className="text-xs text-muted-foreground mt-2">{sub}</div>}
    </div>
  );
}
