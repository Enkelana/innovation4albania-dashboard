import { useNavigate } from "react-router-dom";
import { USERS } from "@/data/mock";
import { useAuth, ROLE_LABEL } from "@/context/AuthContext";
import { ChevronRight, ShieldCheck } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Hero */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-surface border-r border-border overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="absolute -top-40 -right-40 size-[520px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 size-[420px] rounded-full bg-accent/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="size-10 rounded-md bg-gradient-accent grid place-items-center shadow-glow">
            <span className="font-display font-bold text-accent-foreground">i4</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold">Innovation</div>
            <div className="font-display text-lg font-semibold -mt-1 text-accent">4Albania</div>
          </div>
        </div>

        <div className="relative space-y-6 max-w-lg">
          <div className="text-[11px] tracking-[0.25em] text-accent uppercase font-mono">Executive Performance Console</div>
          <h1 className="font-display text-5xl font-medium leading-[1.05] text-balance">
            Performanca e shtetit, <span className="italic text-accent">në kohë reale</span>.
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Një pamje e vetme për të gjitha projektet shtetërore: progres, OKR, risk dhe afate.
            Pa burokraci. Pa raporte. Vetëm vendimmarrje.
          </p>
          <div className="grid grid-cols-3 gap-3 pt-4">
            {[
              { k: "12", l: "Projekte aktive" },
              { k: "8", l: "Ministri" },
              { k: "67%", l: "Performance avg" },
            ].map(s => (
              <div key={s.l} className="rounded-md border border-border bg-surface/60 p-3">
                <div className="font-mono text-xl text-accent">{s.k}</div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-muted-foreground font-mono flex items-center gap-2">
          <ShieldCheck className="size-3.5 text-success" />
          Akses i kontrolluar · Sesion i enkriptuar · v1.0
        </div>
      </div>

      {/* Selector */}
      <div className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <div className="text-[11px] tracking-[0.25em] text-accent uppercase font-mono">Hyrje</div>
            <h2 className="font-display text-3xl font-medium">Zgjidh profilin</h2>
            <p className="text-sm text-muted-foreground">Demo — zgjidh rolin për të hyrë në dashboard.</p>
          </div>

          <div className="space-y-2">
            {USERS.map(u => (
              <button
                key={u.id}
                onClick={() => { login(u); navigate("/"); }}
                className="group w-full text-left p-4 rounded-md border border-border bg-surface hover:bg-surface-hover hover:border-border-strong transition-all flex items-center gap-4"
              >
                <div className="size-10 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-display font-semibold">
                  {u.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{u.name}</div>
                  <div className="text-xs text-accent mt-0.5">{ROLE_LABEL[u.role]}</div>
                  {u.ministry && <div className="text-[11px] text-muted-foreground truncate mt-0.5">{u.ministry}</div>}
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
