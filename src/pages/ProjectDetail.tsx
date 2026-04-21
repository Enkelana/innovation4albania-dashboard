import { useNavigate, useParams } from "react-router-dom";
import { okrAverage, isOverdue, EVENTS, visibleProjectsForUser } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, AlertTriangle, Calendar, Users, Building2 } from "lucide-react";
import { StatusBadge, RiskBadge } from "@/components/dashboard/StatusBadge";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const visible = visibleProjectsForUser(user);
  const p = visible.find(x => x.id === id);
  if (!p) return (
    <div className="p-8 max-w-xl mx-auto text-center space-y-3">
      <div className="font-display text-2xl">Pa akses</div>
      <p className="text-sm text-muted-foreground">Ky projekt nuk i përket ministrisë suaj ose nuk ekziston.</p>
      <button onClick={() => navigate("/")} className="text-accent underline text-sm">Kthehu në dashboard</button>
    </div>
  );

  const okr = okrAverage(p.okr);
  const overdue = isOverdue(p);
  const okrData = [
    { k: "Afatet",       v: p.okr.deadlines },
    { k: "Buxheti",      v: p.okr.budget },
    { k: "Cilësia",      v: p.okr.quality },
    { k: "Impakti",      v: p.okr.impact },
    { k: "Bashkëpunimi", v: p.okr.collaboration },
  ];
  const events = EVENTS.filter(e => e.projectId === p.id).sort((a,b) => +new Date(a.date) - +new Date(b.date));

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1500px] mx-auto">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors">
        <ArrowLeft className="size-4" /> Kthehu
      </button>

      {/* Header */}
      <div className="rounded-lg border border-border bg-gradient-surface p-6 shadow-elev">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] font-mono text-accent uppercase tracking-[0.2em]">{p.code}</span>
              <StatusBadge status={p.status} />
              <RiskBadge risk={p.risk} />
              {overdue && (
                <span className="inline-flex items-center gap-1.5 text-xs text-destructive font-mono uppercase tracking-wider">
                  <AlertTriangle className="size-3.5 animate-pulse-soft" /> Overdue update
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl font-medium mt-3 leading-tight text-balance">{p.name}</h1>
            <p className="text-muted-foreground mt-2 max-w-3xl">{p.description}</p>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono">OKR mesatar</div>
            <div className={cn("font-display text-6xl font-medium tabular mt-1", okr >= 85 ? "text-success" : okr >= 70 ? "text-primary" : okr >= 55 ? "text-warning" : "text-destructive")}>{okr}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
          <Meta icon={Building2} label="Ministritë" value={p.ministries.join(" · ")} />
          <Meta icon={Calendar}  label="Periudha"   value={`${format(new Date(p.startDate), "MMM yyyy")} → ${format(new Date(p.endDate), "MMM yyyy")}`} />
          <Meta icon={Users}     label="Lead / Ekipi" value={`${p.lead} (+${p.team.length - 1})`} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Phases */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-surface p-6 shadow-elev">
          <h3 className="font-display text-lg font-medium">Fazat e projektit</h3>
          <p className="text-xs text-muted-foreground mt-1">Aktualisht në fazën <span className="text-accent font-mono">{p.currentPhase}</span> nga <span className="font-mono">{p.totalPhases}</span></p>

          <div className="mt-6 space-y-1">
            <div className="flex items-center gap-1">
              {Array.from({ length: p.totalPhases }, (_, i) => {
                const idx = i + 1;
                const done = idx < p.currentPhase;
                const current = idx === p.currentPhase;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className={cn(
                      "w-full h-2 rounded-full",
                      done ? "bg-success" : current ? "bg-accent" : "bg-secondary",
                    )} />
                    <div className={cn(
                      "size-7 rounded-full grid place-items-center text-[11px] font-mono font-medium",
                      done ? "bg-success/20 text-success" : current ? "bg-accent text-accent-foreground shadow-glow" : "bg-secondary text-muted-foreground",
                    )}>{idx}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-2">
              <span>Start</span>
              <span className="text-accent">{p.progress}% complete</span>
              <span>End</span>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono mb-3">Ekipi</h4>
            <div className="flex flex-wrap gap-2">
              {p.team.map(t => (
                <div key={t} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-surface-elevated border border-border">
                  <div className="size-6 rounded-full bg-gradient-primary grid place-items-center text-[10px] text-primary-foreground font-medium">
                    {t.split(" ").map(n => n[0]).slice(0,2).join("")}
                  </div>
                  <span className="text-xs">{t}{t === p.lead && <span className="text-accent ml-1.5 text-[10px] font-mono">LEAD</span>}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* OKR radar */}
        <div className="rounded-lg border border-border bg-surface p-6 shadow-elev">
          <h3 className="font-display text-lg font-medium">Performance OKR</h3>
          <p className="text-xs text-muted-foreground mt-1">5 indikatorë · mesatare automatike</p>

          <div className="h-[240px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={okrData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="k" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} stroke="hsl(var(--border))" />
                <Radar dataKey="v" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.35} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border-strong))", borderRadius: 6, fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-5 gap-1 mt-3">
            {okrData.map(d => (
              <div key={d.k} className="text-center">
                <div className={cn("font-mono text-base font-medium", d.v >= 85 ? "text-success" : d.v >= 70 ? "text-primary" : d.v >= 55 ? "text-warning" : "text-destructive")}>{d.v}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{d.k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Events timeline */}
      <div className="rounded-lg border border-border bg-surface p-6 shadow-elev">
        <h3 className="font-display text-lg font-medium">Kalendari i projektit</h3>
        <div className="mt-4 space-y-2">
          {events.length === 0 && <div className="text-sm text-muted-foreground">Asnjë event i regjistruar.</div>}
          {events.map(e => (
            <div key={e.id} className="flex items-center gap-4 p-3 rounded-md bg-surface-elevated border border-border">
              <div className="text-center min-w-[60px]">
                <div className="text-[11px] uppercase font-mono text-muted-foreground">{format(new Date(e.date), "MMM")}</div>
                <div className="font-display text-2xl">{format(new Date(e.date), "dd")}</div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{e.title}</div>
                <div className="text-[11px] font-mono text-accent uppercase tracking-wider mt-0.5">{e.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Meta({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground font-mono">
        <Icon className="size-3" /> {label}
      </div>
      <div className="text-sm font-medium mt-1.5 leading-snug">{value}</div>
    </div>
  );
}
