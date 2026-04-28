import { useMemo, useState } from "react";
import { AlertTriangle, Clock3, Search, ShieldAlert, TrendingDown } from "lucide-react";
import { useRiskDeviations, useProjects } from "@/hooks/use-dashboard-api";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const formatDate = (value?: string) => {
  if (!value) return "Pa afat";
  return new Intl.DateTimeFormat("sq-AL", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
};

const riskTone = (risk: string) => {
  const normalized = risk.toLowerCase();
  if (normalized.includes("kritik")) return "border-destructive/40 bg-destructive/10 text-destructive";
  if (normalized.includes("lartë")) return "border-destructive/30 bg-destructive/10 text-destructive";
  if (normalized.includes("mesatar")) return "border-warning/40 bg-warning/10 text-warning";
  return "border-success/30 bg-success/10 text-success";
};

const urgencyOrder = ["kritike", "lartë", "mesatare", "ulët"];

export default function RiskDeviations() {
  const { user } = useAuth();
  const { data = [] } = useRiskDeviations(user);
  const { data: projects = [] } = useProjects(user);
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [updateFilter, setUpdateFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  const projectById = new Map(projects.map((project) => [project.id, project]));
  const criticalRisk = data.filter((item) => item.risk.toLowerCase().includes("kritik")).length;
  const delayedUpdates = data.filter((item) => item.delayDays > 0).length;
  const highDeviation = data.filter((item) => item.deviationPercent > 10).length;

  const summaryCards = [
    { label: "Risk kritik", value: criticalRisk, icon: ShieldAlert, tone: criticalRisk > 0 ? "text-destructive" : "text-success" },
    { label: "Update të vonuara", value: delayedUpdates, icon: Clock3, tone: delayedUpdates > 0 ? "text-warning" : "text-success" },
    { label: "Devijim < -10%", value: highDeviation, icon: TrendingDown, tone: highDeviation > 0 ? "text-destructive" : "text-success" },
  ];

  const urgencyOptions = useMemo(() => {
    const options = Array.from(new Set(data.map((item) => item.urgency).filter(Boolean)));
    return options.sort((left, right) => {
      const leftIndex = urgencyOrder.findIndex((value) => left.toLowerCase().includes(value));
      const rightIndex = urgencyOrder.findIndex((value) => right.toLowerCase().includes(value));
      return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex);
    });
  }, [data]);

  const filteredData = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return data.filter((item) => {
      const project = projectById.get(item.projectId);
      const ministries = project?.ministries.join(" ").toLowerCase() ?? "";
      const matchesQuery =
        normalizedQuery.length === 0 ||
        item.projectName.toLowerCase().includes(normalizedQuery) ||
        item.projectCode.toLowerCase().includes(normalizedQuery) ||
        item.status.toLowerCase().includes(normalizedQuery) ||
        item.risk.toLowerCase().includes(normalizedQuery) ||
        item.urgency.toLowerCase().includes(normalizedQuery) ||
        ministries.includes(normalizedQuery);

      const matchesRisk = riskFilter === "all" || item.risk.toLowerCase() === riskFilter;
      const isDelayed = item.delayDays > 0;
      const matchesUpdate =
        updateFilter === "all" ||
        (updateFilter === "delayed" && isDelayed) ||
        (updateFilter === "ontime" && !isDelayed);
      const matchesUrgency = urgencyFilter === "all" || item.urgency === urgencyFilter;

      return matchesQuery && matchesRisk && matchesUpdate && matchesUrgency;
    });
  }, [data, projectById, query, riskFilter, updateFilter, urgencyFilter]);

  const filterButtons = [
    { value: "all", label: "Të gjitha" },
    { value: "kritik", label: "Kritik" },
    { value: "lartë", label: "I lartë" },
    { value: "mesatar", label: "Mesatar" },
    { value: "ulët", label: "I ulët" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1300px] mx-auto animate-fade-in">
      <div className="space-y-1 animate-slide-in-down">
        <div className="text-[11px] tracking-[0.25em] text-accent uppercase font-mono">Risk & Devijime</div>
        <h1 className="font-display text-3xl font-medium">Pamje e shpejtë e rrezikut</h1>
        <p className="text-sm text-muted-foreground">Renditur sipas riskut dhe devijimit nga progresi i pritur.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {summaryCards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-lg border border-border bg-surface p-5 shadow-elev animate-scale-in hover:shadow-glow transition-all duration-300">
            <div className="flex items-start justify-between gap-3">
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-medium">{label}</div>
              <Icon className={cn("size-4", tone)} />
            </div>
            <div className={cn("mt-4 font-display text-4xl font-medium", tone)}>{value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-surface p-5 shadow-elev animate-scale-in hover:shadow-glow transition-all duration-300">
        <div className="mb-5 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-medium">Renditje sipas urgjencës</h2>
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{filteredData.length} projekte</span>
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Kërko projekt, kod, ministri, risk..."
                className="pl-9 bg-background border-border"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={updateFilter}
                onChange={(e) => setUpdateFilter(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="all">Të gjitha update-t</option>
                <option value="delayed">Vetëm të vonuara</option>
                <option value="ontime">Vetëm në kohë</option>
              </select>
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="all">Të gjitha urgjencat</option>
                {urgencyOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filterButtons.map((option) => (
              <button
                key={option.value}
                onClick={() => setRiskFilter(option.value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  riskFilter === option.value ? "bg-surface-elevated text-accent" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredData.map((item) => {
            const project = projectById.get(item.projectId);
            const ministries = project?.ministries.join(" · ") ?? "Ministria nuk u gjet";
            const actualDeviation = item.currentProgress - item.expectedProgress;
            const isDelayed = item.delayDays > 0;
            const statusText = isDelayed ? "Update i vonuar" : "Update në kohë";

            return (
              <div key={item.projectId} className="rounded-xl border border-border bg-background/55 p-4 animate-slide-in-up transition-all duration-300 hover:border-border-strong hover:bg-background/80 hover:-translate-y-0.5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-accent">{item.projectCode}</span>
                      <span className="rounded-full border border-border bg-surface-elevated px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{item.status}</span>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-medium", riskTone(item.risk))}>{item.risk}</span>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-medium", isDelayed ? "border-warning/40 bg-warning/10 text-warning" : "border-success/30 bg-success/10 text-success")}>{statusText}</span>
                    </div>

                    <div>
                      <h3 className="font-display text-xl font-medium leading-tight">{item.projectName}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{ministries} · OKR {project?.okrAverage ?? 0}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-destructive">
                    <AlertTriangle className="size-4" />
                    <span className="text-xs font-medium">{item.urgency}</span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-border bg-surface px-3 py-3">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Progres</div>
                    <div className="mt-1 font-mono text-2xl text-foreground">{item.currentProgress}%</div>
                  </div>
                  <div className="rounded-lg border border-border bg-surface px-3 py-3">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">I pritur</div>
                    <div className="mt-1 font-mono text-2xl text-foreground">{item.expectedProgress}%</div>
                  </div>
                  <div className="rounded-lg border border-border bg-surface px-3 py-3">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Devijim</div>
                    <div className={cn("mt-1 font-mono text-2xl", actualDeviation < -10 ? "text-destructive" : actualDeviation < 0 ? "text-warning" : "text-success")}>
                      {actualDeviation > 0 ? "+" : ""}{actualDeviation}%
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-muted-foreground">
                  Afati: <span className="font-mono text-foreground">{formatDate(project?.endDate)}</span> · {item.daysRemaining} ditë mbetur · {item.status}
                </div>
              </div>
            );
          })}

          {filteredData.length === 0 && (
            <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
              Nuk ka projekte që përputhen me filtrat ose kërkimin tuaj.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


