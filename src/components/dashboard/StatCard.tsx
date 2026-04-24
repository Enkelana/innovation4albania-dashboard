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
    <div className="group relative w-full min-w-0 rounded-lg border border-border bg-surface p-5 shadow-elev hover:border-border-strong hover:shadow-glow transition-smooth animate-slide-in-up hover:translate-y-[-4px]">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium leading-snug break-words">{label}</div>
        <Icon className={cn("size-4", toneClasses[tone], "opacity-80 group-hover:scale-110 transition-transform")} />
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <div className={cn("font-display text-3xl font-medium tabular group-hover:scale-105 transition-transform origin-left", toneClasses[tone])}>{value}</div>
        {trend && (
          <div className={cn("text-xs font-mono animate-slide-in-right", trend.up ? "text-success" : "text-destructive")}>
            {trend.up ? "▲" : "▼"} {trend.value}
          </div>
        )}
      </div>
      {sub && <div className="text-xs text-muted-foreground mt-2 opacity-75 group-hover:opacity-100 transition-opacity">{sub}</div>}
    </div>
  );
}

