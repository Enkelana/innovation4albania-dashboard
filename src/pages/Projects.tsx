import { useState } from "react";
import ProjectsTable from "@/components/dashboard/ProjectsTable";
import { PROJECTS } from "@/data/mock";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const STATUSES = [
  { v: "all", l: "Të gjitha" },
  { v: "active", l: "Aktive" },
  { v: "in_progress", l: "Në proces" },
  { v: "at_risk", l: "Me risk" },
  { v: "completed", l: "Përfunduar" },
  { v: "cancelled", l: "Anuluar" },
];

export default function Projects() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  return (
    <div className="p-6 lg:p-8 space-y-5 max-w-[1500px] mx-auto">
      <div>
        <div className="text-[11px] tracking-[0.25em] text-accent uppercase font-mono">Portfolio</div>
        <h1 className="font-display text-3xl font-medium mt-1">Të gjitha projektet</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Kërko projekt, kod, ministri..." className="pl-9 bg-surface border-border" />
        </div>
        <div className="flex gap-1 p-1 rounded-md bg-surface border border-border">
          {STATUSES.map(s => (
            <button
              key={s.v}
              onClick={() => setStatus(s.v)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${status === s.v ? "bg-surface-elevated text-accent" : "text-muted-foreground hover:text-foreground"}`}
            >
              {s.l}
            </button>
          ))}
        </div>
      </div>

      <ProjectsTable filter={(p) => {
        if (status !== "all" && p.status !== status) return false;
        if (!q) return true;
        const hay = (p.name + p.code + p.ministries.join(" ")).toLowerCase();
        return hay.includes(q.toLowerCase());
      }} />
    </div>
  );
}
