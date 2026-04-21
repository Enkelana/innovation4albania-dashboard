import { okrAverage, visibleProjectsForUser } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
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

export function StatusPie() {
  const counts = PROJECTS.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const data = [
    { name: "Aktiv",        value: counts.active || 0,       color: "hsl(var(--info))" },
    { name: "Në proces",    value: counts.in_progress || 0,  color: "hsl(var(--primary))" },
    { name: "Përfunduar",   value: counts.completed || 0,    color: "hsl(var(--success))" },
    { name: "Me risk",      value: counts.at_risk || 0,      color: "hsl(var(--destructive))" },
    { name: "Anuluar",      value: counts.cancelled || 0,    color: "hsl(var(--muted-foreground))" },
  ].filter(d => d.value > 0);

  return (
    <div className="rounded-lg border border-border bg-surface p-5 shadow-elev h-full">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="font-display text-base font-medium">Shpërndarja e statusit</h3>
        <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">{PROJECTS.length} total</span>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} stroke="hsl(var(--background))" strokeWidth={2}>
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-1.5 mt-2">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-2 text-xs">
            <span className="size-2 rounded-sm" style={{ background: d.color }} />
            <span className="text-muted-foreground flex-1">{d.name}</span>
            <span className="font-mono text-foreground">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PerformanceBar() {
  const data = PROJECTS.map(p => ({
    name: p.code,
    score: okrAverage(p.okr),
  })).sort((a, b) => b.score - a.score);

  return (
    <div className="rounded-lg border border-border bg-surface p-5 shadow-elev h-full">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="font-display text-base font-medium">Performanca për projekt (OKR mesatar)</h3>
        <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Renditur</span>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontFamily: "JetBrains Mono" }} stroke="hsl(var(--border))" />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} stroke="hsl(var(--border))" domain={[0, 100]} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--surface-hover))" }} />
            <Bar dataKey="score" radius={[3, 3, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.score >= 85 ? "hsl(var(--success))" : d.score >= 70 ? "hsl(var(--primary))" : d.score >= 55 ? "hsl(var(--warning))" : "hsl(var(--destructive))"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ProgressTimeline() {
  // Synthetic monthly progress trend
  const months = ["Maj", "Qer", "Kor", "Gus", "Sht", "Tet", "Nën", "Dhj", "Jan", "Shk", "Mar", "Pri"];
  const data = months.map((m, i) => ({
    m,
    progres: Math.round(28 + i * 4 + Math.sin(i) * 6),
    okr: Math.round(55 + i * 1.6 + Math.cos(i) * 4),
  }));

  return (
    <div className="rounded-lg border border-border bg-surface p-5 shadow-elev h-full">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h3 className="font-display text-base font-medium">Trend i progresit kombëtar</h3>
          <p className="text-xs text-muted-foreground mt-0.5">12 muajt e fundit · agreguar</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-primary" /><span className="text-muted-foreground">Progres</span></span>
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-accent" /><span className="text-muted-foreground">OKR</span></span>
        </div>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
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
