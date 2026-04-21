import { useState } from "react";
import { EVENTS, visibleProjectsForUser } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, format,
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_CONF: Record<string, { label: string; cls: string }> = {
  kickoff:  { label: "Nisje",     cls: "bg-info/20 text-info border-info/40" },
  meeting:  { label: "Takim",     cls: "bg-primary/20 text-primary border-primary/40" },
  deadline: { label: "Deadline",  cls: "bg-destructive/20 text-destructive border-destructive/40" },
  delivery: { label: "Dorëzim",   cls: "bg-accent/20 text-accent border-accent/40" },
};

const WEEKDAYS = ["Hën", "Mar", "Mër", "Enj", "Pre", "Sht", "Die"];

export default function CalendarView() {
  const [cursor, setCursor] = useState(new Date());
  const { user } = useAuth();
  const PROJECTS = visibleProjectsForUser(user);
  const allowedIds = new Set(PROJECTS.map(p => p.id));
  const visibleEvents = EVENTS.filter(e => allowedIds.has(e.projectId));
  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const today = new Date();
  const upcoming = visibleEvents
    .filter(e => new Date(e.date) >= new Date(today.setHours(0,0,0,0)))
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .slice(0, 8);

  return (
    <div className="p-6 lg:p-8 space-y-5 max-w-[1500px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-[11px] tracking-[0.25em] text-accent uppercase font-mono">Kalendari ekzekutiv</div>
          <h1 className="font-display text-3xl font-medium mt-1">Aktivitetet e muajit</h1>
        </div>
        <div className="flex items-center gap-3">
          {Object.entries(TYPE_CONF).map(([k, v]) => (
            <span key={k} className={cn("inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded border font-mono uppercase tracking-wider", v.cls)}>
              {v.label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-4">
        <div className="rounded-lg border border-border bg-surface shadow-elev">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="font-display text-xl capitalize">{format(cursor, "MMMM yyyy")}</div>
            <div className="flex items-center gap-1">
              <button onClick={() => setCursor(addMonths(cursor, -1))} className="p-2 rounded hover:bg-surface-hover text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" /></button>
              <button onClick={() => setCursor(new Date())} className="px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider text-accent hover:bg-surface-hover">Sot</button>
              <button onClick={() => setCursor(addMonths(cursor, 1))} className="p-2 rounded hover:bg-surface-hover text-muted-foreground hover:text-foreground"><ChevronRight className="size-4" /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-border">
            {WEEKDAYS.map(d => (
              <div key={d} className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-muted-foreground border-r last:border-r-0 border-border">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              const inMonth = isSameMonth(day, cursor);
              const isToday = isSameDay(day, new Date());
              const dayEvents = visibleEvents.filter(e => isSameDay(new Date(e.date), day));
              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-[110px] p-2 border-r border-b border-border last:border-r-0 [&:nth-child(7n)]:border-r-0",
                    !inMonth && "bg-background/50",
                  )}
                >
                  <div className={cn(
                    "inline-flex items-center justify-center size-6 rounded-full text-xs font-mono",
                    isToday ? "bg-accent text-accent-foreground font-semibold" : inMonth ? "text-foreground" : "text-muted-foreground/40",
                  )}>
                    {format(day, "d")}
                  </div>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 3).map(e => {
                      const proj = PROJECTS.find(p => p.id === e.projectId);
                      const conf = TYPE_CONF[e.type];
                      return (
                        <div key={e.id} className={cn("text-[10px] leading-tight px-1.5 py-1 rounded border truncate", conf.cls)} title={`${proj?.code} — ${e.title}`}>
                          <span className="font-mono">{proj?.code}</span> · {e.title}
                        </div>
                      );
                    })}
                    {dayEvents.length > 3 && <div className="text-[10px] text-muted-foreground">+{dayEvents.length - 3} më shumë</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming */}
        <div className="rounded-lg border border-border bg-surface shadow-elev">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <CalendarIcon className="size-4 text-accent" />
            <div className="font-display text-base font-medium">Të ardhshme</div>
          </div>
          <div className="p-3 space-y-2">
            {upcoming.map(e => {
              const proj = PROJECTS.find(p => p.id === e.projectId);
              const conf = TYPE_CONF[e.type];
              return (
                <div key={e.id} className="p-3 rounded-md bg-surface-elevated border border-border">
                  <div className="flex items-center justify-between">
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded border font-mono uppercase tracking-wider", conf.cls)}>{conf.label}</span>
                    <span className="text-[11px] font-mono text-muted-foreground">{format(new Date(e.date), "dd MMM")}</span>
                  </div>
                  <div className="text-sm font-medium mt-2 leading-snug">{e.title}</div>
                  <div className="text-[11px] font-mono text-muted-foreground mt-1">{proj?.code} · {proj?.name.slice(0, 40)}{(proj?.name.length || 0) > 40 ? "…" : ""}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
