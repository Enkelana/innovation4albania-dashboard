import { useMemo, useState } from "react";
import { Plus, Search, UsersRound } from "lucide-react";
import ProjectsTable from "@/components/dashboard/ProjectsTable";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useCreateProject, useProjects, useStatuses } from "@/hooks/use-dashboard-api";
import type { CreateProjectPayload, OKR, ProjectPriority, ProjectSector, ProjectStatus, RiskLevel, WorkgroupRole } from "@/types";

const defaultOkr: OKR = { deadlines: 60, quality: 60, impact: 60, collaboration: 60 };

const priorityOptions: Array<{ value: ProjectPriority; label: string }> = [
  { value: "critical", label: "Kritike" },
  { value: "high", label: "E lartë" },
  { value: "medium", label: "Mesatare" },
  { value: "low", label: "E ulët" },
];

const sectorOptions: Array<{ value: ProjectSector; label: string }> = [
  { value: "digitalization", label: "Digjitalizim" },
  { value: "infrastructure", label: "Infrastrukturë" },
  { value: "public_services", label: "Shërbime publike" },
  { value: "governance", label: "Qeverisje" },
  { value: "education", label: "Arsim" },
  { value: "health", label: "Shëndetësi" },
  { value: "agriculture", label: "Bujqësi" },
  { value: "environment", label: "Mjedis" },
];

const workgroupRoleOptions: Array<{ value: WorkgroupRole; label: string }> = [
  { value: "project_lead", label: "Drejtues projekti" },
  { value: "okr_owner", label: "Pronar OKR" },
  { value: "business_analyst", label: "Analist biznesi" },
  { value: "legal_expert", label: "Ekspert ligjor" },
  { value: "technical_coordinator", label: "Koordinator teknik" },
  { value: "data_specialist", label: "Specialist të dhënash" },
  { value: "ministry_representative", label: "Përfaqësues ministrie" },
  { value: "project_officer", label: "Ekspert" },
];

function buildEmptyProject(): CreateProjectPayload {
  return {
    code: "",
    name: "",
    description: "",
    ministries: [],
    agency: "Drejtoria e Inovacionit",
    status: "planning",
    priority: "medium",
    sector: "digitalization",
    totalPhases: 5,
    currentPhase: 1,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString().slice(0, 10),
    progress: 0,
    okr: defaultOkr,
    risk: "medium",
    team: [],
    teamMembers: [
      { name: "", role: "project_lead", unit: "Njësi qendrore", allocationPercent: 80 },
    ],
    lead: "",
    updateCadenceDays: 14,
    objectives: [
      {
        title: "",
        owner: "Drejtoria e Inovacionit",
        keyResults: [{ title: "", progress: 0, target: 100, unit: "%" }],
      },
    ],
  };
}

export default function Projects() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreateProjectPayload>(buildEmptyProject);
  const { data: statuses = [] } = useStatuses();
  const { data: projects = [], isLoading } = useProjects(user, { status, query: q });
  const createProject = useCreateProject(user);

  const statusOptions = useMemo(() => [{ value: "all", label: "Të gjitha" }, ...statuses], [statuses]);

  const updateObjective = (index: number, field: "title" | "owner", value: string) => {
    setForm((current) => {
      const objectives = [...current.objectives];
      objectives[index] = { ...objectives[index], [field]: value };
      return { ...current, objectives };
    });
  };

  const updateKr = (objectiveIndex: number, krIndex: number, field: "title" | "progress" | "target" | "unit", value: string) => {
    setForm((current) => {
      const objectives = [...current.objectives];
      const keyResults = [...objectives[objectiveIndex].keyResults];
      keyResults[krIndex] = {
        ...keyResults[krIndex],
        [field]: field === "progress" || field === "target" ? Number(value) : value,
      };
      objectives[objectiveIndex] = { ...objectives[objectiveIndex], keyResults };
      return { ...current, objectives };
    });
  };

  const updateTeamMember = (index: number, field: "name" | "role" | "unit", value: string) => {
    setForm((current) => {
      const teamMembers = [...current.teamMembers];
      teamMembers[index] = {
        ...teamMembers[index],
        [field]: value,
      };
      return { ...current, teamMembers };
    });
  };

  const addTeamMember = () => {
    setForm((current) => ({
      ...current,
      teamMembers: [...current.teamMembers, { name: "", role: "project_officer", unit: "Njësi projekti", allocationPercent: 0 }],
    }));
  };

  const removeTeamMember = (index: number) => {
    setForm((current) => ({
      ...current,
      teamMembers: current.teamMembers.filter((_, memberIndex) => memberIndex !== index),
    }));
  };

  const submit = async () => {
    const teamMembers = form.teamMembers
      .filter((member) => member.name.trim().length > 0)
      .map((member) => ({
        name: member.name.trim(),
        role: member.role,
        unit: member.unit.trim() || "Njësi qendrore",
        allocationPercent: Number(member.allocationPercent),
      }));

    const payload = {
      ...form,
      ministries: form.ministries.filter(Boolean),
      team: teamMembers.map((member) => member.name),
      teamMembers,
      updateCadenceDays: 14,
      objectives: form.objectives.map((objective) => ({
        ...objective,
        keyResults: objective.keyResults.filter((kr) => kr.title.trim().length > 0),
      })).filter((objective) => objective.title.trim().length > 0),
    };

    await createProject.mutateAsync(payload);
    setForm(buildEmptyProject());
    setShowCreate(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-5 max-w-[1600px] mx-auto animate-fade-in">
      <div className="flex items-end justify-between gap-4 flex-wrap animate-slide-in-down">
        <div>
          <div className="text-[11px] tracking-[0.25em] text-accent uppercase font-mono">Portofoli</div>
          <h1 className="font-display text-3xl font-medium mt-1">Projektet</h1>
          <p className="text-sm text-muted-foreground mt-1">Filtër kërkimi, 6 statuse, fusha të strukturuara dhe krijim projekti me ndërtues OKR.</p>
        </div>
        {(user?.role === "drejtor_agjencie" || user?.role === "drejtor_inovacioni_publik") && (
          <button onClick={() => setShowCreate((value) => !value)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="size-4" /> Krijo projekt
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 animate-slide-in-up">
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Kërko projekt, kod, ministri, prioritet, sektor ose rol..." className="pl-9 bg-surface border-border" />
        </div>
        <div className="flex flex-wrap gap-1 p-1 rounded-md bg-surface border border-border">
          {statusOptions.map((s) => (
            <button key={s.value} onClick={() => setStatus(s.value)} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${status === s.value ? "bg-surface-elevated text-accent" : "text-muted-foreground hover:text-foreground"}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {showCreate && (user?.role === "drejtor_agjencie" || user?.role === "drejtor_inovacioni_publik") && (
        <div className="rounded-lg border border-border bg-surface p-5 shadow-elev space-y-4 animate-scale-in hover:shadow-glow transition-all duration-300">
          <div>
            <h3 className="font-display text-xl font-medium">Krijo projekt të ri</h3>
            <p className="text-sm text-muted-foreground mt-1">Plotëso fushat bazë, strukturën e ekipit, prioritetin, sektorin dhe OKR-të. Përditësimi është fiks çdo 14 ditë.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <Field label="Kodi"><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></Field>
            <Field label="Emri"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Agjencia"><Input value={form.agency ?? ""} onChange={(e) => setForm({ ...form, agency: e.target.value })} /></Field>
            <Field label="Përgjegjësi"><Input value={form.lead} onChange={(e) => setForm({ ...form, lead: e.target.value })} /></Field>
            <Field label="Statusi">
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </Field>
            <Field label="Riski">
              <select value={form.risk} onChange={(e) => setForm({ ...form, risk: e.target.value as RiskLevel })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                <option value="low">I ulët</option>
                <option value="medium">Mesatar</option>
                <option value="high">I lartë</option>
                <option value="critical">Kritik</option>
              </select>
            </Field>
            <Field label="Prioriteti">
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as ProjectPriority })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                {priorityOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </Field>
            <Field label="Sektori">
              <select value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value as ProjectSector })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                {sectorOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </Field>
            <Field label="Faza aktuale"><Input type="number" value={form.currentPhase} onChange={(e) => setForm({ ...form, currentPhase: Number(e.target.value) })} /></Field>
            <Field label="Numri total i fazave"><Input type="number" value={form.totalPhases} onChange={(e) => setForm({ ...form, totalPhases: Number(e.target.value) })} /></Field>
            <Field label="Data e nisjes"><Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></Field>
            <Field label="Data e mbylljes"><Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></Field>
            <Field label="Progresi %"><Input type="number" value={form.progress} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} /></Field>
            <Field label="Ritmi i përditësimit"><Input value="14 ditë (fikse)" readOnly /></Field>
          </div>

          <Field label="Përshkrimi">
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-[96px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </Field>

          <Field label="Ministritë (ndarë me presje)">
            <Input value={form.ministries.join(", ")} onChange={(e) => setForm({ ...form, ministries: e.target.value.split(",").map((item) => item.trim()) })} />
          </Field>

          <div className="rounded-lg border border-border bg-background/60 p-4 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h4 className="font-display text-lg font-medium">Struktura e projektit: grupe pune dhe role</h4>
                <p className="text-sm text-muted-foreground mt-1">Përcakto anëtarët, rolin dhe njësinë për secilin.</p>
              </div>
              <button onClick={addTeamMember} type="button" className="inline-flex items-center gap-2 text-sm text-accent">
                <UsersRound className="size-4" /> Shto anëtar
              </button>
            </div>

            <div className="space-y-3">
              {form.teamMembers.map((member, index) => (
                <div key={`${member.role}-${index}`} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.3fr_0.95fr_1.1fr_90px] gap-3 rounded-md border border-border bg-surface p-3">
                  <Field label={`Anëtari ${index + 1}`}><Input value={member.name} onChange={(e) => updateTeamMember(index, "name", e.target.value)} /></Field>
                  <Field label="Roli">
                    <select value={member.role} onChange={(e) => updateTeamMember(index, "role", e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                      {workgroupRoleOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Njësia / grupi i punës"><Input value={member.unit} onChange={(e) => updateTeamMember(index, "unit", e.target.value)} /></Field>
                  <div className="flex items-end">
                    <button type="button" onClick={() => removeTeamMember(index)} disabled={form.teamMembers.length === 1} className="w-full rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50">Hiq</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(form.okr).map(([key, value]) => (
              <Field key={key} label={`OKR - ${key}`}>
                <Input type="number" value={value} onChange={(e) => setForm({ ...form, okr: { ...form.okr, [key]: Number(e.target.value) } })} />
              </Field>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-lg font-medium">Ndërtues OKR</h4>
              <button onClick={() => setForm((current) => ({ ...current, objectives: [...current.objectives, { title: "", owner: "Drejtoria e Inovacionit", keyResults: [{ title: "", progress: 0, target: 100, unit: "%" }] }] }))} className="text-sm text-accent">+ Shto objektiv</button>
            </div>

            {form.objectives.map((objective, objectiveIndex) => (
              <div key={objectiveIndex} className="rounded-md border border-border bg-background/60 p-4 space-y-3 animate-slide-in-up hover:border-border-strong transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Objektivi"><Input value={objective.title} onChange={(e) => updateObjective(objectiveIndex, "title", e.target.value)} /></Field>
                  <Field label="Owner"><Input value={objective.owner} onChange={(e) => updateObjective(objectiveIndex, "owner", e.target.value)} /></Field>
                </div>
                {objective.keyResults.map((kr, krIndex) => (
                  <div key={krIndex} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Field label={`KR ${krIndex + 1}`}><Input value={kr.title} onChange={(e) => updateKr(objectiveIndex, krIndex, "title", e.target.value)} /></Field>
                    <Field label="Progresi"><Input type="number" value={kr.progress} onChange={(e) => updateKr(objectiveIndex, krIndex, "progress", e.target.value)} /></Field>
                    <Field label="Target"><Input type="number" value={kr.target} onChange={(e) => updateKr(objectiveIndex, krIndex, "target", e.target.value)} /></Field>
                    <Field label="Njësia"><Input value={kr.unit} onChange={(e) => updateKr(objectiveIndex, krIndex, "unit", e.target.value)} /></Field>
                  </div>
                ))}
                <button onClick={() => setForm((current) => {
                  const objectives = [...current.objectives];
                  objectives[objectiveIndex] = { ...objectives[objectiveIndex], keyResults: [...objectives[objectiveIndex].keyResults, { title: "", progress: 0, target: 100, unit: "%" }] };
                  return { ...current, objectives };
                })} className="text-sm text-accent">+ Shto KR</button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => void submit()} disabled={createProject.isPending} className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium disabled:opacity-60">Ruaj projektin</button>
            {createProject.isError && <span className="text-sm text-destructive">{createProject.error instanceof Error ? createProject.error.message : "Gabim gjatë ruajtjes."}</span>}
          </div>
        </div>
      )}

      <ProjectsTable projects={projects} isLoading={isLoading} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1 block">
      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

