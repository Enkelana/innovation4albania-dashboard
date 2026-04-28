import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command } from "cmdk";
import { Search, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const commands = [
  { id: "dashboard", label: "Pamje e pÃ«rgjithshme", description: "Shko nÃ« dashboard", path: "/" },
  { id: "projects", label: "Projektet", description: "Shikoni tÃ« gjitha projektet", path: "/projects" },
  { id: "performance", label: "Tabela e performancÃ«s", description: "Performanca e projekteve", path: "/performance" },
  { id: "calendar", label: "Kalendari", description: "Shikoni kalendariin", path: "/calendar" },
  { id: "risk", label: "Risk & Devijime", description: "Analizoni rreziqet", path: "/risk-devijime" },
  { id: "updates", label: "PÃ«rditÃ«simet", description: "PÃ«rditÃ«simet mÃ« tÃ« reja", path: "/perditesimet" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      {/* Keyboard Hint */}
      <div className="fixed top-4 right-4 z-40 hidden sm:block animate-slide-in-down">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface/40 border border-border text-muted-foreground hover:text-foreground hover:bg-surface/60 hover:border-accent transition-all hover:shadow-glow group"
        >
          <Search className="size-4 group-hover:rotate-180 transition-transform" />
          <span className="hidden md:inline">KÃ«rko...</span>
          <kbd className="ml-1 px-2 py-1 rounded bg-surface text-xs font-mono group-hover:bg-accent/20 transition-colors">âŒ˜K</kbd>
        </button>
      </div>

      {/* Command Palette Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md animate-scale-in-big"
            onClick={(e) => e.stopPropagation()}
          >
            <Command className="bg-surface border border-border rounded-lg shadow-elev overflow-hidden">
              <div className="flex items-center gap-3 border-b border-border px-4 py-3 animate-slide-in-down">
                <Search className="size-4 text-accent animate-pulse-soft" />
                <Command.Input
                  placeholder="KÃ«rko faqet, projektet..."
                  className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground text-foreground"
                  autoFocus
                />
              </div>
              <Command.List className="max-h-[300px] overflow-y-auto">
                <Command.Empty className="px-4 py-8 text-center text-muted-foreground text-sm animate-fade-in">
                  Nuk u gjet asgjÃ«.
                </Command.Empty>
                <Command.Group heading="Navigimi" className="overflow-hidden p-1">
                  {commands.map((cmd, idx) => (
                    <Command.Item
                      key={cmd.id}
                      value={cmd.label}
                      onSelect={() => {
                        navigate(cmd.path);
                        setOpen(false);
                      }}
                      className={cn(
                        "relative flex cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2.5 outline-none hover:bg-surface-hover aria-selected:bg-accent aria-selected:text-accent-foreground transition-all hover:translate-x-1 animate-slide-in-left"
                      )}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <ArrowRight className="size-4 text-muted-foreground group-hover:text-accent transition-colors" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{cmd.label}</div>
                        <div className="text-xs text-muted-foreground">{cmd.description}</div>
                      </div>
                      <Zap className="size-3 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}

