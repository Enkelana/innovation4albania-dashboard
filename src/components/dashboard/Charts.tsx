import { useAuth } from "@/context/AuthContext";
import { useMinistryDistribution, usePerformanceScores, useStatusDistribution, useTrend } from "@/hooks/use-dashboard-api";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border-strong))",
  borderRadius: 6,
  fontSize: 12,
  color: "hsl(var(--popover-foreground))",
} as const;

const statusOrder = [
  "planning",
  "active",
  "at_risk",
  "blocked",
  "completed",
  "cancelled",
] as const;

const normalizeStatusLabel = (status: string, label: string) => {
  const statusMap: Record<string, string> = {
    planning: "Planifikim",
    active: "Aktive",
    at_risk: "Në risk",
    blocked: "Pauzë",
    completed: "Përfunduara",
    cancelled: "Të anuluara",
  };

  return statusMap[status] || label;
};
export function StatusPie() {
  const { user } = useAuth();
  const { data = [] } = useStatusDistribution(user);
  const chartData = [...data]
    .map((item) => ({ ...item, label: normalizeStatusLabel(item.status, item.label) }))
    .sort((left, right) => statusOrder.indexOf(left.status as (typeof statusOrder)[number]) - statusOrder.indexOf(right.status as (typeof statusOrder)[number]));
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-lg border border-border bg-surface p-5 shadow-elev h-full animate-scale-in hover:shadow-glow transition-shadow">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="font-display text-base font-medium">Shpërndarja e statuseve</h3>
        <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider animate-slide-in-right">{total} gjithsej</span>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} stroke="hsl(var(--background))" strokeWidth={2}>
              {chartData.map((d) => <Cell key={d.status} fill={d.color} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-1.5 mt-2">
        {data.map((d, i) => (
          <div key={d.status} className="flex items-center gap-2 text-xs hover:text-accent transition-colors animate-slide-in-left" style={{ animationDelay: `${i * 30}ms` }}>
            <span className="size-2 rounded-sm hover:scale-125 transition-transform" style={{ background: d.color }} />
            <span className="text-muted-foreground flex-1">{d.label}</span>
            <span className="font-mono text-foreground font-medium">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PerformanceBar() {
  const { user } = useAuth();
  const { data = [] } = usePerformanceScores(user);

  return (
    <div className="rounded-lg border border-border bg-surface p-5 shadow-elev h-full animate-scale-in hover:shadow-glow transition-shadow">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="font-display text-base font-medium">Performanca për projekt (OKR mesatar)</h3>
        <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider animate-slide-in-right">E renditur</span>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.map((item) => ({ name: item.code, score: item.score }))} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontFamily: "JetBrains Mono" }} stroke="hsl(var(--border))" />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} stroke="hsl(var(--border))" domain={[0, 100]} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--surface-hover))" }} />
            <Bar dataKey="score" radius={[3, 3, 0, 0]}>
              {data.map((d) => (
                <Cell
                  key={d.projectId}
                  fill={
                    d.score >= 85
                      ? "hsl(var(--success))"
                      : d.score >= 70
                        ? "hsl(var(--primary))"
                        : d.score >= 55
                          ? "hsl(var(--warning))"
                          : "hsl(var(--destructive))"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ProgressTimeline() {
  const { data = [] } = useTrend(12);

  return (
    <div className="rounded-lg border border-border bg-surface p-5 shadow-elev h-full animate-scale-in hover:shadow-glow transition-shadow">
      <div className="flex items-baseline justify-between mb-4">
        <div className="animate-slide-in-left">
          <h3 className="font-display text-base font-medium">Trendi 12-mujor</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Progresi dhe OKR i portofolit</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-primary" /><span className="text-muted-foreground">Progresi</span></span>
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-accent" /><span className="text-muted-foreground">OKR</span></span>
        </div>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.map((item) => ({ m: item.label, progres: item.progress, okr: item.okr }))} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.35} />
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="m" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} stroke="hsl(var(--border))" />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} stroke="hsl(var(--border))" />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="progres" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#gp)" />
            <Area type="monotone" dataKey="okr" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#ga)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function MinistryBar() {
  const { user } = useAuth();
  const { data = [] } = useMinistryDistribution(user);
  const sortedData = [...data].sort((left, right) => right.value - left.value);
  const maxValue = Math.max(...sortedData.map((item) => item.value), 1);
  const total = sortedData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-lg border border-border bg-surface p-5 shadow-elev h-full">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h3 className="font-display text-base font-medium">Shpërndarja sipas ministrive</h3>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">{total} projekte</span>
      </div>

      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
        {sortedData.map((item) => {
          const width = `${Math.max(8, Math.round((item.value / maxValue) * 100))}%`;
          return (
            <div key={item.ministry} className="rounded-md border border-border bg-background/45 px-3 py-2.5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="min-w-0 flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: item.color }} />
                  <span className="truncate text-xs font-medium text-foreground">{item.ministry}</span>
                </div>
                <span className="shrink-0 rounded-full bg-surface-elevated px-2 py-0.5 font-mono text-xs text-foreground">
                  {item.value}
                </span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-muted">
                <div className="absolute inset-y-0 left-0 rounded-full" style={{ width, background: item.color }} />
                <div className="absolute inset-y-0 right-[24%] w-px bg-background/80" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}








