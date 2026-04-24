import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, AlertTriangle, Calendar, Users, Building2, Sparkles, ShieldAlert, CircleCheckBig, Lightbulb, BrainCircuit } from "lucide-react";
import { StatusBadge, RiskBadge } from "@/components/dashboard/StatusBadge";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { sq } from "date-fns/locale";
import { useProject, useProjectAiInsights, useProjectEvents } from "@/hooks/use-dashboard-api";

const attentionLabels: Record<string, string> = {
  normal: "Normale",
  medium: "Mesatare",
  high: "E lartë",
  critical: "Kritike",
};

const eventTypeLabels: Record<string, string> = {
  kickoff: "Nisja e projektit",
  completion: "Mbyllja e projektit",
  meeting: "Takim",
  deadline: "Afat",
  delivery: "Dorëzim",
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: project, isLoading } = useProject(user, id);
  const { data: events = [] } = useProjectEvents(user, id);
  const { data: aiInsights } = useProjectAiInsights(user, id);

  if (isLoading) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Duke ngarkuar projektin...</div>;
  }

  if (!project) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-3">
        <div className="font-display text-2xl">Pa akses</div>
        <p className="text-sm text-muted-foreground">Ky projekt nuk i përket ministrisë suaj ose nuk ekziston.</p>
        <button onClick={() => navigate("/")} className="text-accent underline text-sm">Kthehu te pamja kryesore</button>
      </div>
    );
  }

  const okrData = [
    { k: "Afatet", v: project.okr.deadlines },
    { k: "Cilësia", v: project.okr.quality },
    { k: "Impakti", v: project.okr.impact },
    { k: "Bashkëpunimi", v: project.okr.collaboration },
  ];

  const riskBase = project.risk === "critical" ? 75 : project.risk === "high" ? 55 : project.risk === "medium" ? 30 : 8;
  const riskPenalty = Math.max(0, 100 - project.okrAverage) * 0.35;
  const progressPenalty = project.progress < project.expectedProgress ? (project.expectedProgress - project.progress) * 0.45 : 0;
  const aiRiskScore = Math.max(1, Math.min(100, Math.round(riskBase + riskPenalty + progressPenalty)));
  const aiRiskMessage = `Bazuar në OKR mesatar (${project.okrAverage}), nivelin e riskut (${project.risk}), performancën aktuale, modeli sugjeron ${aiRiskScore <= 20 ? "vazhdimësi normale" : aiRiskScore <= 45 ? "monitorim të rregullt" : aiRiskScore <= 70 ? "vëmendje të shtuar" : "ndërhyrje prioritare"}.`;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1500px] mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-all duration-300 animate-slide-in-left">
        <ArrowLeft className="size-4" /> Kthehu
      </button>

      <div className="rounded-lg border border-border bg-gradient-surface p-6 shadow-elev animate-scale-in hover:shadow-glow transition-all duration-300">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] font-mono text-accent uppercase tracking-[0.2em]">{project.code}</span>
              <StatusBadge status={project.status} />
              <RiskBadge risk={project.risk} />
              {project.isOverdue && (
                <span className="inline-flex items-center gap-1.5 text-xs text-destructive font-mono uppercase tracking-wider">
                  <AlertTriangle className="size-3.5 animate-pulse-soft" /> Përditësim i vonuar
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl font-medium mt-3 leading-tight text-balance">{project.name}</h1>
            <p className="text-muted-foreground mt-2 max-w-3xl">{project.description}</p>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono">OKR mesatar</div>
            <div className={cn("font-display text-6xl font-medium tabular mt-1", project.okrAverage >= 85 ? "text-success" : project.okrAverage >= 70 ? "text-primary" : project.okrAverage >= 55 ? "text-warning" : "text-destructive")}>{project.okrAverage}%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
          <Meta icon={Building2} label="Ministritë" value={project.ministries.join(" · ")} />
          <Meta icon={Calendar} label="Periudha" value={`${format(new Date(project.startDate), "MMM yyyy", { locale: sq })} → ${format(new Date(project.endDate), "MMM yyyy", { locale: sq })}`} />
          <Meta icon={Users} label="Përgjegjësi / Ekipi" value={`${project.lead} (+${Math.max(0, project.team.length - 1)})`} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-lg border border-border bg-surface p-6 shadow-elev animate-slide-in-up hover:shadow-glow transition-all duration-300">
          <h3 className="font-display text-lg font-medium">Fazat e projektit</h3>
          <p className="text-xs text-muted-foreground mt-1">Aktualisht në fazën <span className="text-accent font-mono">{project.currentPhase}</span> nga <span className="font-mono">{project.totalPhases}</span></p>

          <div className="mt-6 space-y-1">
            <div className="flex items-center gap-1">
              {Array.from({ length: project.totalPhases }, (_, i) => {
                const idx = i + 1;
                const done = idx < project.currentPhase;
                const current = idx === project.currentPhase;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className={cn("w-full h-2 rounded-full", done ? "bg-success" : current ? "bg-accent" : "bg-secondary")} />
                    <div className={cn("size-7 rounded-full grid place-items-center text-[11px] font-mono font-medium", done ? "bg-success/20 text-success" : current ? "bg-accent text-accent-foreground shadow-glow" : "bg-secondary text-muted-foreground")}>{idx}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-2">
              <span>Fillimi</span>
              <span className="text-accent">{project.progress}% e plotësuar</span>
              <span>Mbarimi</span>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono mb-3">Ekipi</h4>
            <div className="flex flex-wrap gap-2">
              {project.team.map((member) => (
                <div key={member} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-surface-elevated border border-border">
                  <div className="size-6 rounded-full bg-gradient-primary grid place-items-center text-[10px] text-primary-foreground font-medium">
                    {member.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <span className="text-xs">{member}{member === project.lead && <span className="text-accent ml-1.5 text-[10px] font-mono">PËRGJEGJËS</span>}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6 shadow-elev animate-slide-in-up hover:shadow-glow transition-all duration-300">
          <h3 className="font-display text-lg font-medium">Performanca OKR</h3>
          <p className="text-xs text-muted-foreground mt-1">4 indikatorë · mesatare automatike</p>

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

          <div className="grid grid-cols-4 gap-1 mt-3">
            {okrData.map((d) => (
              <div key={d.k} className="text-center">
                <div className={cn("font-mono text-base font-medium", d.v >= 85 ? "text-success" : d.v >= 70 ? "text-primary" : d.v >= 55 ? "text-warning" : "text-destructive")}>{d.v}%</div>
                <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{d.k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {aiInsights && (
        <div className="rounded-lg border border-border bg-surface p-6 shadow-elev animate-slide-in-up hover:shadow-glow transition-all duration-300">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-accent font-mono">
                <Sparkles className="size-3.5" />
                Analisti AI i projektit
              </div>
              <h3 className="font-display text-xl font-medium mt-2">Përmbledhje AI + Shpjegim AI i riskut</h3>
              <p className="text-sm text-muted-foreground mt-1">Analizë automatike bazuar në OKR, risk, progres, afate dhe ritmin e përditësimit.</p>
            </div>
            <div className={cn(
              "px-3 py-2 rounded-md border text-xs font-mono uppercase tracking-wider",
              aiInsights.attentionLevel === "critical" ? "border-destructive/40 bg-destructive/10 text-destructive" :
              aiInsights.attentionLevel === "high" ? "border-warning/40 bg-warning/10 text-warning" :
              aiInsights.attentionLevel === "medium" ? "border-primary/40 bg-primary/10 text-primary" :
              "border-success/40 bg-success/10 text-success",
            )}>
              Vëmendje: {attentionLabels[aiInsights.attentionLevel] ?? aiInsights.attentionLevel}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-4 mt-6">
            <div className="space-y-4">
              <div className="rounded-md border border-border bg-surface-elevated p-4">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono">Përmbledhje AI</div>
                <p className="text-sm leading-6 mt-2">{aiInsights.summary}</p>
              </div>

              <div className="rounded-md border border-border bg-surface-elevated p-4">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground font-mono">
                  <ShieldAlert className="size-3.5" />
                  Shpjegim AI i riskut
                </div>
                <p className="text-sm leading-6 mt-2">{aiInsights.riskExplanation}</p>
              </div>
            </div>

            <div className="rounded-md border border-border bg-surface-elevated p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono">Besueshmëria</div>
              <div className="font-display text-5xl mt-2">{aiInsights.confidenceScore}<span className="text-xl text-muted-foreground">%</span></div>
              <p className="text-xs text-muted-foreground mt-2">Shkallë besueshmërie e analizës së gjeneruar nga të dhënat aktuale të projektit.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            <InsightList title="Sinjale pozitive" icon={<CircleCheckBig className="size-4 text-success" />} items={aiInsights.positiveSignals} accentClass="text-success" />
            <InsightList title="Çështje kritike" icon={<AlertTriangle className="size-4 text-warning" />} items={aiInsights.concerns} accentClass="text-warning" />
            <InsightList title="Rekomandime" icon={<Lightbulb className="size-4 text-accent" />} items={aiInsights.recommendations} accentClass="text-accent" />
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border bg-surface p-6 shadow-elev animate-slide-in-up hover:shadow-glow transition-all duration-300">
        <h3 className="font-display text-lg font-medium">Kalendari i projektit</h3>
        <div className="mt-4 space-y-2">
          {events.length === 0 && <div className="text-sm text-muted-foreground">Asnjë ngjarje e regjistruar.</div>}
          {events.map((eventItem) => (
            <div key={eventItem.id} className="flex items-center gap-4 p-3 rounded-md bg-surface-elevated border border-border animate-slide-in-up transition-all duration-300 hover:border-border-strong hover:-translate-y-0.5">
              <div className="text-center min-w-[60px]">
                <div className="text-[11px] uppercase font-mono text-muted-foreground">{format(new Date(eventItem.date), "MMM", { locale: sq })}</div>
                <div className="font-display text-2xl">{format(new Date(eventItem.date), "dd", { locale: sq })}</div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{eventItem.title}</div>
                <div className="text-[11px] font-mono text-accent uppercase tracking-wider mt-0.5">{eventTypeLabels[eventItem.type] ?? eventItem.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6 shadow-elev animate-slide-in-up hover:shadow-glow transition-all duration-300">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-accent font-mono">
              <BrainCircuit className="size-3.5" />
              AI Risk Prediction
            </div>
            <h3 className="font-display text-xl font-medium mt-2">Parashikimi i riskut të projektit</h3>
          </div>
          <div className="rounded-xl border border-border bg-surface-elevated px-5 py-4 text-right">
            <div className={cn("font-display text-5xl font-medium", aiRiskScore <= 20 ? "text-success" : aiRiskScore <= 45 ? "text-primary" : aiRiskScore <= 70 ? "text-warning" : "text-destructive")}>{aiRiskScore}</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono">Risk Score / 100</div>
          </div>
        </div>
        <p className="mt-4 max-w-4xl text-sm leading-6 text-muted-foreground">{aiRiskMessage}</p>
      </div>
    </div>
  );
}

function Meta({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground font-mono"><Icon className="size-3" /> {label}</div>
      <div className="text-sm font-medium mt-1.5 leading-snug">{value}</div>
    </div>
  );
}

function InsightList({
  title,
  icon,
  items,
  accentClass,
}: {
  title: string;
  icon: JSX.Element;
  items: string[];
  accentClass: string;
}) {
  return (
    <div className="rounded-md border border-border bg-surface-elevated p-4">
      <div className={cn("flex items-center gap-2 text-[11px] uppercase tracking-wider font-mono", accentClass)}>
        {icon}
        {title}
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item} className="text-sm leading-6 text-foreground/90">• {item}</div>
        ))}
      </div>
    </div>
  );
}

