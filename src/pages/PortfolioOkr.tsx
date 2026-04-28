import { useState } from "react";
import { useCreatePortfolioObjective, usePortfolioOkr } from "@/hooks/use-dashboard-api";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";

export default function PortfolioOkr() {
  const { user } = useAuth();
  const { data, isLoading } = usePortfolioOkr(user);
  const createObjective = useCreatePortfolioObjective(user);
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("Drejtoria e Inovacionit");
  const [krs, setKrs] = useState([{ title: "", progress: 0, target: 100, unit: "%" }]);

  const submit = async () => {
    await createObjective.mutateAsync({ title, owner, keyResults: krs.filter((kr) => kr.title.trim().length > 0) });
    setTitle("");
    setOwner("Drejtoria e Inovacionit");
    setKrs([{ title: "", progress: 0, target: 100, unit: "%" }]);
  };

  return (
    <div className="p-6 lg:p-8 space-y-5 max-w-[1500px] mx-auto animate-fade-in">
      <div>
        <div className="text-[11px] tracking-[0.25em] text-accent uppercase font-mono">OKR Portofol</div>
        <h1 className="font-display text-3xl font-medium mt-1">KPI-të e portofolit dhe objektivat</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card label="OKR mesatar" value={`${data?.metrics.averageOkr ?? 0}%`} />
        <Card label="Në kohë" value={`${data?.metrics.onTimePercentage ?? 0}%`} />
        <Card label="Devijimi mesatar" value={`${data?.metrics.deviationAverage ?? 0}%`} />
        <Card label="Kërkojnë vëmendje" value={data?.metrics.projectsNeedingAttention ?? 0} />
      </div>

      <div className="rounded-lg border border-border bg-surface p-5 shadow-elev space-y-4 animate-scale-in hover:shadow-glow transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl font-medium">Shto objektiv të portofolit</h3>
            <p className="text-sm text-muted-foreground mt-1">Vetëm Drejtori i Inovacionit mund të shtojë objektiva të reja.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Titulli"><Input value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
          <Field label="Owner"><Input value={owner} onChange={(e) => setOwner(e.target.value)} /></Field>
        </div>

        {krs.map((kr, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Field label={`KR ${index + 1}`}><Input value={kr.title} onChange={(e) => setKrs((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, title: e.target.value } : item))} /></Field>
            <Field label="Progresi"><Input type="number" value={kr.progress} onChange={(e) => setKrs((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, progress: Number(e.target.value) } : item))} /></Field>
            <Field label="Target"><Input type="number" value={kr.target} onChange={(e) => setKrs((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, target: Number(e.target.value) } : item))} /></Field>
            <Field label="Njësia"><Input value={kr.unit} onChange={(e) => setKrs((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, unit: e.target.value } : item))} /></Field>
          </div>
        ))}

        <div className="flex items-center gap-3">
          <button onClick={() => setKrs((current) => [...current, { title: "", progress: 0, target: 100, unit: "%" }])} className="text-sm text-accent">+ Shto KR</button>
          <button onClick={() => void submit()} disabled={createObjective.isPending} className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium disabled:opacity-60">Ruaj objektivin</button>
          {createObjective.isError && <span className="text-sm text-destructive">{createObjective.error instanceof Error ? createObjective.error.message : "Gabim."}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {isLoading && <div className="text-sm text-muted-foreground">Duke ngarkuar OKR-të...</div>}
        {data?.objectives.map((objective) => (
          <div key={objective.id} className="rounded-lg border border-border bg-surface p-5 shadow-elev animate-slide-in-up hover:shadow-glow transition-all duration-300">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium">{objective.title}</div>
                <div className="text-xs text-muted-foreground mt-1">Owner: {objective.owner}</div>
              </div>
              <div className="font-mono text-xl text-accent">{objective.progress}%</div>
            </div>
            <div className="mt-4 space-y-3">
              {objective.keyResults.map((kr) => (
                <div key={kr.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{kr.title}</span>
                    <span className="font-mono text-muted-foreground">{kr.progress}/{kr.target} {kr.unit}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${kr.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg border border-border bg-surface p-5 shadow-elev animate-slide-in-up hover:shadow-glow transition-all duration-300"><div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</div><div className="font-display text-3xl mt-3">{value}</div></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="space-y-1 block"><span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</span>{children}</label>;
}



