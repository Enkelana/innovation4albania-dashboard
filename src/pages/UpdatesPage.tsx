import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useChangeProposals, useCreateChangeProposal, useCreateWeeklyUpdate, useProjects, useStatuses, useWeeklyUpdates } from "@/hooks/use-dashboard-api";
import { Input } from "@/components/ui/input";
import type { OKR, ProjectStatus, RiskLevel } from "@/types";

const emptyOkr: OKR = { deadlines: 60, quality: 60, impact: 60, collaboration: 60 };

export default function UpdatesPage() {
  const { user } = useAuth();
  const canEdit = user?.role === "drejtor_agjencie" || user?.role === "drejtor_inovacioni_publik" || user?.role === "staf_agjencie";
  const canProposeChanges = user?.role === "staf_agjencie";
  const { data: projects = [] } = useProjects(user);
  const { data: statuses = [] } = useStatuses();
  const { data: updates = [] } = useWeeklyUpdates(user);
  const { data: proposals = [] } = useChangeProposals(user);
  const createUpdate = useCreateWeeklyUpdate(user);
  const createProposal = useCreateChangeProposal(user);

  const [projectId, setProjectId] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<ProjectStatus>("active");
  const [risk, setRisk] = useState<RiskLevel>("medium");
  const [okr, setOkr] = useState<OKR>(emptyOkr);
  const [blockers, setBlockers] = useState("");
  const [comments, setComments] = useState("");

  const [proposalProjectId, setProposalProjectId] = useState("");
  const [proposalType, setProposalType] = useState<"deadline" | "content">("deadline");
  const [currentValue, setCurrentValue] = useState("");
  const [proposedValue, setProposedValue] = useState("");
  const [proposalReason, setProposalReason] = useState("");

  const [updateQuery, setUpdateQuery] = useState("");
  const [updateStatusFilter, setUpdateStatusFilter] = useState("all");
  const [updateRiskFilter, setUpdateRiskFilter] = useState("all");
  const [proposalQuery, setProposalQuery] = useState("");
  const [proposalTypeFilter, setProposalTypeFilter] = useState("all");

  const selectableProjects = useMemo(() => projects.filter((project) => project.status !== "completed" && project.status !== "cancelled"), [projects]);
  const proposalProject = projects.find((project) => project.id === proposalProjectId);

  const filteredUpdates = useMemo(() => {
    const q = updateQuery.trim().toLowerCase();
    return updates.filter((update) => {
      const matchesQuery =
        q.length === 0 ||
        update.projectCode.toLowerCase().includes(q) ||
        update.projectName.toLowerCase().includes(q) ||
        update.submittedBy.toLowerCase().includes(q) ||
        update.status.toLowerCase().includes(q) ||
        update.risk.toLowerCase().includes(q) ||
        update.comments.toLowerCase().includes(q) ||
        update.blockers.toLowerCase().includes(q);
      const matchesStatus = updateStatusFilter === "all" || update.status === updateStatusFilter;
      const matchesRisk = updateRiskFilter === "all" || update.risk === updateRiskFilter;
      return matchesQuery && matchesStatus && matchesRisk;
    });
  }, [updates, updateQuery, updateStatusFilter, updateRiskFilter]);

  const filteredProposals = useMemo(() => {
    const q = proposalQuery.trim().toLowerCase();
    return proposals.filter((proposal) => {
      const matchesQuery =
        q.length === 0 ||
        proposal.projectCode.toLowerCase().includes(q) ||
        proposal.projectName.toLowerCase().includes(q) ||
        proposal.submittedBy.toLowerCase().includes(q) ||
        proposal.typeLabel.toLowerCase().includes(q) ||
        proposal.reason.toLowerCase().includes(q) ||
        proposal.status.toLowerCase().includes(q);
      const matchesType = proposalTypeFilter === "all" || proposal.type === proposalTypeFilter;
      return matchesQuery && matchesType;
    });
  }, [proposalQuery, proposalTypeFilter, proposals]);

  const submit = async () => {
    await createUpdate.mutateAsync({ projectId, progress, status, okr, risk, blockers, comments });
    setProjectId("");
    setProgress(0);
    setStatus("active");
    setRisk("medium");
    setOkr(emptyOkr);
    setBlockers("");
    setComments("");
  };

  const submitProposal = async () => {
    await createProposal.mutateAsync({
      projectId: proposalProjectId,
      type: proposalType,
      currentValue,
      proposedValue,
      reason: proposalReason,
    });
    setProposalProjectId("");
    setProposalType("deadline");
    setCurrentValue("");
    setProposedValue("");
    setProposalReason("");
  };

  return (
    <div className="p-6 lg:p-8 space-y-5 max-w-[1500px] mx-auto animate-fade-in">
      <div>
        <div className="text-[11px] tracking-[0.25em] text-accent uppercase font-mono">Përditësimet</div>
        <h1 className="font-display text-3xl font-medium mt-1">Formulari dyjavor dhe historiku</h1>
        <p className="text-sm text-muted-foreground mt-1">Raportimi dhe përditësimi i projekteve realizohet me ritëm fiks çdo 14 ditë.</p>
      </div>

      {canEdit && (
        <div className="rounded-lg border border-border bg-surface p-5 shadow-elev space-y-4 animate-scale-in hover:shadow-glow transition-all duration-300">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-display text-xl font-medium">Shto përditësim dyjavor</h3>
              <p className="text-sm text-muted-foreground mt-1">Ky formular ndjek ciklin standard dyjavor për progresin, OKR, riskun dhe pengesat.</p>
            </div>
            <div className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-accent">Cikël fiks · 14 ditë</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Field label="Projekti">
              <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                <option value="">Zgjidh projektin</option>
                {selectableProjects.map((project) => <option key={project.id} value={project.id}>{project.code} · {project.name}</option>)}
              </select>
            </Field>
            <Field label="Progresi %"><Input type="number" value={progress} onChange={(e) => setProgress(Number(e.target.value))} /></Field>
            <Field label="Statusi">
              <select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </Field>
            <Field label="Riski">
              <select value={risk} onChange={(e) => setRisk(e.target.value as RiskLevel)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                <option value="low">I ulët</option>
                <option value="medium">Mesatar</option>
                <option value="high">I lartë</option>
                <option value="critical">Kritik</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(okr).map(([key, value]) => (
              <Field key={key} label={`OKR - ${key}`}><Input type="number" value={value} onChange={(e) => setOkr({ ...okr, [key]: Number(e.target.value) })} /></Field>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Pengesat"><textarea value={blockers} onChange={(e) => setBlockers(e.target.value)} className="min-h-[90px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm" /></Field>
            <Field label="Komentet"><textarea value={comments} onChange={(e) => setComments(e.target.value)} className="min-h-[90px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm" /></Field>
          </div>

          <button onClick={() => void submit()} disabled={createUpdate.isPending || !projectId} className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium disabled:opacity-60">Ruaj përditësimin</button>
        </div>
      )}

      {canProposeChanges && (
        <div className="rounded-lg border border-border bg-surface p-5 shadow-elev space-y-4 animate-scale-in hover:shadow-glow transition-all duration-300">
          <div>
            <h3 className="font-display text-xl font-medium">Propozo ndryshim në projekt</h3>
            <p className="text-sm text-muted-foreground mt-1">Përdoret kur nevojitet ndryshim në afate ose në përmbajtjen e projektit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="Projekti">
              <select value={proposalProjectId} onChange={(e) => {
                const nextId = e.target.value;
                const selected = projects.find((project) => project.id === nextId);
                setProposalProjectId(nextId);
                setCurrentValue(proposalType === "deadline" && selected ? new Date(selected.endDate).toLocaleDateString("sq-AL") : selected?.description ?? "");
              }} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                <option value="">Zgjidh projektin</option>
                {selectableProjects.map((project) => <option key={project.id} value={project.id}>{project.code} · {project.name}</option>)}
              </select>
            </Field>
            <Field label="Tipi i ndryshimit">
              <select value={proposalType} onChange={(e) => {
                const type = e.target.value as "deadline" | "content";
                setProposalType(type);
                setCurrentValue(type === "deadline" && proposalProject ? new Date(proposalProject.endDate).toLocaleDateString("sq-AL") : proposalProject?.description ?? "");
              }} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                <option value="deadline">Ndryshim afati</option>
                <option value="content">Ndryshim përmbajtjeje</option>
              </select>
            </Field>
            <Field label={proposalType === "deadline" ? "Afati i ri" : "Përmbajtja e re"}>
              {proposalType === "deadline" ? (
                <Input type="date" value={proposedValue} onChange={(e) => setProposedValue(e.target.value)} />
              ) : (
                <Input value={proposedValue} onChange={(e) => setProposedValue(e.target.value)} placeholder="Përshkrim i shkurtër i ndryshimit" />
              )}
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Gjendja aktuale"><textarea value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} className="min-h-[90px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm" /></Field>
            <Field label="Arsyeja e propozimit"><textarea value={proposalReason} onChange={(e) => setProposalReason(e.target.value)} className="min-h-[90px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm" /></Field>
          </div>

          <button onClick={() => void submitProposal()} disabled={createProposal.isPending || !proposalProjectId || !proposedValue || !proposalReason} className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium disabled:opacity-60">Dërgo propozimin</button>
        </div>
      )}

      {canProposeChanges && (
        <div className="space-y-3">
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-elev animate-slide-in-up sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-xl font-medium">Historiku i propozimeve</h3>
              <p className="text-sm text-muted-foreground mt-1">Kërko dhe filtro propozimet sipas projektit ose tipit.</p>
            </div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{filteredProposals.length} propozime</div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={proposalQuery} onChange={(e) => setProposalQuery(e.target.value)} placeholder="Kërko projekt, person, tip ose arsye..." className="pl-9 bg-background border-border" />
            </div>
            <select value={proposalTypeFilter} onChange={(e) => setProposalTypeFilter(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option value="all">Të gjitha propozimet</option>
              <option value="deadline">Vetëm afatet</option>
              <option value="content">Vetëm përmbajtja</option>
            </select>
          </div>

          {filteredProposals.length === 0 && <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">Nuk ka propozime që përputhen me kërkimin ose filtrin.</div>}
          {filteredProposals.map((proposal) => (
            <div key={proposal.id} className="rounded-lg border border-border bg-surface p-5 shadow-elev animate-slide-in-up hover:shadow-glow transition-all duration-300">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="font-medium">{proposal.projectCode} · {proposal.projectName}</div>
                  <div className="text-xs text-muted-foreground mt-1">{proposal.submittedBy} · {proposal.submittedRole} · {new Date(proposal.submittedAt).toLocaleString("sq-AL")}</div>
                </div>
                <div className="rounded-full border border-warning/40 bg-warning/10 px-3 py-1 text-xs font-mono text-warning">{proposal.status}</div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div><span className="text-muted-foreground">Tipi:</span> {proposal.typeLabel}</div>
                <div><span className="text-muted-foreground">Aktuale:</span> {proposal.currentValue}</div>
                <div><span className="text-muted-foreground">E propozuar:</span> {proposal.proposedValue}</div>
              </div>
              <div className="mt-3 text-sm"><span className="text-muted-foreground">Arsyeja:</span> {proposal.reason}</div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-elev animate-slide-in-up sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-xl font-medium">Historiku i përditësimeve</h3>
            <p className="text-sm text-muted-foreground mt-1">Kërko sipas projektit, personit, statusit ose riskut.</p>
          </div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{filteredUpdates.length} përditësime</div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_220px_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={updateQuery} onChange={(e) => setUpdateQuery(e.target.value)} placeholder="Kërko projekt, person, koment, risk..." className="pl-9 bg-background border-border" />
          </div>
          <select value={updateStatusFilter} onChange={(e) => setUpdateStatusFilter(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
            <option value="all">Të gjitha statuset</option>
            {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          <select value={updateRiskFilter} onChange={(e) => setUpdateRiskFilter(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
            <option value="all">Të gjitha nivelet e riskut</option>
            <option value="low">I ulët</option>
            <option value="medium">Mesatar</option>
            <option value="high">I lartë</option>
            <option value="critical">Kritik</option>
          </select>
        </div>

        {filteredUpdates.length === 0 && <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">Nuk ka përditësime që përputhen me kërkimin ose filtrat.</div>}
        {filteredUpdates.map((update) => (
          <div key={update.id} className="rounded-lg border border-border bg-surface p-5 shadow-elev animate-slide-in-up hover:shadow-glow transition-all duration-300">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="font-medium">{update.projectCode} · {update.projectName}</div>
                <div className="text-xs text-muted-foreground mt-1">{update.submittedBy} · {update.submittedRole} · {new Date(update.submittedAt).toLocaleString("sq-AL")}</div>
              </div>
              <div className="font-mono text-accent">OKR {update.okrAverage}%</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 text-sm">
              <div><span className="text-muted-foreground">Progresi:</span> {update.progress}%</div>
              <div><span className="text-muted-foreground">Statusi:</span> {update.status}</div>
              <div><span className="text-muted-foreground">Riski:</span> {update.risk}</div>
              <div><span className="text-muted-foreground">Pengesat:</span> {update.blockers}</div>
            </div>
            <div className="mt-3 text-sm"><span className="text-muted-foreground">Komentet:</span> {update.comments}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="space-y-1 block"><span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</span>{children}</label>;
}

