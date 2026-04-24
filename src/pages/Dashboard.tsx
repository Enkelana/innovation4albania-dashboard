import { AlertTriangle, FolderKanban, CheckCircle2, PauseCircle, XCircle, ShieldAlert, ClipboardList, Clock3, Gauge, TimerOff, TrendingUp } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { MinistryBar, PerformanceBar, ProgressTimeline, StatusPie } from "@/components/dashboard/Charts";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABEL } from "@/constants/roles";
import { useDashboardSummary, useProjects } from "@/hooks/use-dashboard-api";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: summary } = useDashboardSummary(user);
  const { data: projects = [] } = useProjects(user);

  const portfolio = summary?.portfolio;
  const statusCards = summary?.statusCards ?? [];
  const getStatusValue = (key: string) => statusCards.find((card) => card.key === key)?.value ?? 0;
  const delayed = projects.filter((project) => project.delayDays > 0 || project.isOverdue).length;
  const criticalProjects = projects.filter((project) => project.risk === "critical").length;
  const successfulProjects = projects.filter((project) => project.okrAverage > 80).length;
  const avgOkr = portfolio?.averageOkr ?? 0;
  const avgProgress = projects.length === 0 ? 0 : Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length);
  const onTimePercentage = portfolio?.onTimePercentage ?? 0;
  const deviationAverage = portfolio?.deviationAverage ?? 0;

  const topCards = [
    { key: "total", label: "Gjithsej", value: summary?.totalProjects ?? 0, icon: FolderKanban, tone: "default" as const },
    { key: "planning", label: "Planifikim", value: getStatusValue("planning"), icon: ClipboardList, tone: "warning" as const },
    { key: "active", label: "Aktive", value: getStatusValue("active"), icon: FolderKanban, tone: "danger" as const },
    { key: "at_risk", label: "Në risk", value: getStatusValue("at_risk"), icon: ShieldAlert, tone: getStatusValue("at_risk") > 0 ? "danger" as const : "default" as const },
    { key: "blocked", label: "Pauzë", value: getStatusValue("blocked"), icon: PauseCircle, tone: "default" as const },
    { key: "completed", label: "Përfunduara", value: getStatusValue("completed"), icon: CheckCircle2, tone: "success" as const },
    { key: "cancelled", label: "Të anuluara", value: getStatusValue("cancelled"), icon: XCircle, tone: "default" as const },
    { key: "delayed", label: "Me vonesë", value: delayed, icon: AlertTriangle, tone: delayed > 0 ? "danger" as const : "success" as const },
    { key: "critical_projects", label: "Kritike", value: criticalProjects, icon: AlertTriangle, tone: criticalProjects > 0 ? "danger" as const : "success" as const },
    { key: "successful_projects", label: "Suksesshme", value: successfulProjects, icon: CheckCircle2, tone: successfulProjects > 0 ? "success" as const : "default" as const },
    { key: "avg_okr", label: "OKR mesatar", value: `${avgOkr}%`, icon: TrendingUp, tone: avgOkr >= 70 ? "success" as const : "warning" as const, wide: true },
  ];
  const portfolioCards = [
    { key: "portfolio_progress", label: "Progresi mesatar i portofolit", value: `${avgProgress}%`, icon: Gauge, tone: avgProgress >= 70 ? "success" as const : avgProgress >= 45 ? "warning" as const : "danger" as const },

    { key: "on_time", label: "Projekte në kohë", value: `${onTimePercentage}%`, icon: Clock3, tone: onTimePercentage >= 75 ? "success" as const : onTimePercentage >= 50 ? "warning" as const : "danger" as const },
    { key: "deviation", label: "Devijim nga afatet", value: deviationAverage, sub: "mesatarja në pikë progresi", icon: TimerOff, tone: deviationAverage <= 5 ? "success" as const : deviationAverage <= 12 ? "warning" as const : "danger" as const },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] tracking-[0.25em] text-accent uppercase font-mono">Pamje ekzekutive</div>
          <h1 className="font-display text-4xl font-medium mt-1">Mirë se erdhët, <span className="italic">{ROLE_LABEL[user?.role || "kryeminister"]}</span>.</h1>
          <p className="text-muted-foreground mt-1 text-sm">Kartat kryesore të statusit dhe performancës së portofolit.</p>
        </div>
        {portfolio && portfolio.projectsNeedingAttention > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-md border border-destructive/40 bg-destructive/10 text-destructive text-sm">
            <AlertTriangle className="size-4 animate-pulse-soft" />
            <span><strong className="font-mono">{portfolio.projectsNeedingAttention}</strong> projekte kërkojnë ndërhyrje</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-12 gap-3">
        {topCards.map((card) => (
          <div key={card.key} className={card.key === "avg_okr" ? "col-span-2" : "col-span-1"}><StatCard label={card.label} value={card.value} icon={card.icon} tone={card.tone} /></div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {portfolioCards.map((card) => (
          <StatCard key={card.key} label={card.label} value={card.value} sub={card.sub} icon={card.icon} tone={card.tone} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <StatusPie />
        <div className="xl:col-span-2"><ProgressTimeline /></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <PerformanceBar />
        <MinistryBar />
      </div>

    </div>
  );
}








