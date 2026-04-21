import { FolderKanban, Activity, CheckCircle2, XCircle, AlertOctagon, TrendingUp, Loader2, AlertTriangle } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import ProjectsTable from "@/components/dashboard/ProjectsTable";
import { PerformanceBar, ProgressTimeline, StatusPie } from "@/components/dashboard/Charts";
import { okrAverage, isOverdue, visibleProjectsForUser } from "@/data/mock";
import { useAuth, ROLE_LABEL } from "@/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const projects = visibleProjectsForUser(user);

  const total = projects.length;
  const active = projects.filter(p => p.status === "active").length;
  const inProgress = projects.filter(p => p.status === "in_progress").length;
  const completed = projects.filter(p => p.status === "completed").length;
  const cancelled = projects.filter(p => p.status === "cancelled").length;
  const atRisk = projects.filter(p => p.status === "at_risk" || p.risk === "critical" || p.risk === "high").length;
  const avgPerf = projects.length ? Math.round(projects.reduce((s, p) => s + okrAverage(p.okr), 0) / projects.length) : 0;
  const overdue = projects.filter(isOverdue).length;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1500px] mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] tracking-[0.25em] text-accent uppercase font-mono">Executive overview</div>
          <h1 className="font-display text-4xl font-medium mt-1">
            Mirë se erdhët, <span className="italic">{ROLE_LABEL[user?.role || "kryeminister"]}</span>.
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Pamja kombëtare e projekteve shtetërore
          </p>
        </div>
        {overdue > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-md border border-destructive/40 bg-destructive/10 text-destructive text-sm">
            <AlertTriangle className="size-4 animate-pulse-soft" />
            <span><strong className="font-mono">{overdue}</strong> projekte pa update — overdue</span>
          </div>
        )}
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        <StatCard label="Total projekte"  value={total}      icon={FolderKanban} />
        <StatCard label="Aktive"          value={active}     icon={Activity}     tone="accent" />
        <StatCard label="Në proces"       value={inProgress} icon={Loader2}      tone="default" />
        <StatCard label="Përfunduar"      value={completed}  icon={CheckCircle2} tone="success" />
        <StatCard label="Anuluar"         value={cancelled}  icon={XCircle} />
        <StatCard label="Me risk"         value={atRisk}     icon={AlertOctagon} tone="danger" />
        <StatCard label="Performance avg" value={`${avgPerf}%`} icon={TrendingUp} tone={avgPerf >= 70 ? "success" : "warning"} trend={{ value: "4.2%", up: true }} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1"><StatusPie /></div>
        <div className="lg:col-span-2"><ProgressTimeline /></div>
      </div>

      <PerformanceBar />

      {/* Table */}
      <ProjectsTable />
    </div>
  );
}
