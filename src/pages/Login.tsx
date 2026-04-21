import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MINISTRIES } from "@/data/mock";
import { useAuth, ROLE_LABEL } from "@/context/AuthContext";
import type { Role, User } from "@/types";
import { ChevronRight, ShieldCheck, ArrowLeft, Crown, Briefcase, Building2, UsersRound, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLES: { role: Role; icon: any; needsMinistry: boolean; hint: string }[] = [
  { role: "kryeminister",    icon: Crown,         needsMinistry: false, hint: "Akses i plotë në të gjitha projektet" },
  { role: "minister",        icon: Briefcase,     needsMinistry: false, hint: "Akses në të gjitha ministritë" },
  { role: "drejtor_agjencie",icon: Building2,     needsMinistry: false, hint: "Akses në të gjitha ministritë" },
  { role: "staf_agjencie",   icon: UsersRound,    needsMinistry: false, hint: "Akses në të gjitha ministritë" },
  { role: "staf_ministrie",  icon: ClipboardList, needsMinistry: true,  hint: "Akses vetëm në ministrinë e tij" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"role" | "ministry">("role");
  const [selectedRole, setSelectedRole] = useState<typeof ROLES[number] | null>(null);

  const handleRolePick = (r: typeof ROLES[number]) => {
    if (r.needsMinistry) {
      setSelectedRole(r);
      setStep("ministry");
    } else {
      doLogin(r.role, undefined);
    }
  };

  const doLogin = (role: Role, ministry: string | undefined) => {
    const user: User = {
      id: `${role}-${Date.now()}`,
      name: ROLE_LABEL[role],
      role,
      ministry,
    };
    login(user);
    navigate("/");
  };

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
          <div className="text-[11px] tracking-[0.25em] text-accent uppercase font-mono">Innovation4Albania</div>
          <h1 className="font-display text-5xl font-medium leading-[1.05] text-balance">
            Platforma e <span className="italic text-accent">Menaxhimit të Projekteve</span>.
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Një pamje e vetme për të gjitha projektet shtetërore: progres, OKR, risk dhe afate.
          </p>
        </div>

        <div className="relative text-xs text-muted-foreground font-mono flex items-center gap-2">
          <ShieldCheck className="size-3.5 text-success" />
          Akses i kontrolluar · Sesion i enkriptuar · v1.0
        </div>
      </div>

      {/* Selector */}
      <div className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          {step === "role" && (
            <>
              <div className="space-y-2">
                <div className="text-[11px] tracking-[0.25em] text-accent uppercase font-mono">Hyrje · Hapi 1/2</div>
                <h2 className="font-display text-3xl font-medium">Zgjidh rolin</h2>
                <p className="text-sm text-muted-foreground">Aksesi në projekte filtrohet sipas rolit dhe ministrisë.</p>
              </div>

              <div className="space-y-2">
                {ROLES.map(r => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.role}
                      onClick={() => handleRolePick(r)}
                      className="group w-full text-left p-4 rounded-md border border-border bg-surface hover:bg-surface-hover hover:border-border-strong transition-all flex items-center gap-4"
                    >
                      <div className={cn(
                        "size-10 rounded-md grid place-items-center shrink-0",
                        r.role === "kryeminister" ? "bg-gradient-accent text-accent-foreground shadow-glow" : "bg-surface-elevated text-accent border border-border-strong",
                      )}>
                        <Icon className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{ROLE_LABEL[r.role]}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{r.hint}</div>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === "ministry" && selectedRole && (
            <>
              <button
                onClick={() => { setStep("role"); setSelectedRole(null); }}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors"
              >
                <ArrowLeft className="size-3.5" /> Mbrapa
              </button>

              <div className="space-y-2">
                <div className="text-[11px] tracking-[0.25em] text-accent uppercase font-mono">Hyrje · Hapi 2/2</div>
                <h2 className="font-display text-3xl font-medium">Zgjidh ministrinë</h2>
                <p className="text-sm text-muted-foreground">
                  Po hyn si <span className="text-accent">{ROLE_LABEL[selectedRole.role]}</span>. Do të shohësh vetëm projektet e ministrisë së zgjedhur.
                </p>
              </div>

              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {MINISTRIES.map(m => (
                  <button
                    key={m}
                    onClick={() => doLogin(selectedRole.role, m)}
                    className="group w-full text-left p-3.5 rounded-md border border-border bg-surface hover:bg-surface-hover hover:border-accent/50 transition-all flex items-center gap-3"
                  >
                    <div className="size-8 rounded bg-surface-elevated border border-border-strong grid place-items-center shrink-0">
                      <Building2 className="size-4 text-accent" />
                    </div>
                    <div className="flex-1 text-sm leading-tight">{m}</div>
                    <ChevronRight className="size-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
