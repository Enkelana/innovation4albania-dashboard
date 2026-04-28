import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, format } from "date-fns";
import { sq } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCalendarMonth, useUpcomingEvents } from "@/hooks/use-dashboard-api";
import { Input } from "@/components/ui/input";

const TYPE_CONF: Record<string, { label: string; cls: string }> = {
  kickoff: { label: "Nisja e projektit", cls: "bg-info/20 text-info border-info/40" },
  completion: { label: "Mbyllja e projektit", cls: "bg-success/20 text-success border-success/40" },
};

const WEEKDAYS = ["Hën", "Mar", "Mër", "Enj", "Pre", "Sht", "Die"];

export default function CalendarView() {
  const [cursor, setCursor] = useState(new Date());
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const { user } = useAuth();
  const { data: monthData } = useCalendarMonth(user, cursor);
  const { data: upcoming = [] } = useUpcomingEvents(user, 12);

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const fallbackDays = eachDayOfInterval({ start: gridStart, end: gridEnd }).map((day) => ({
    date: day.toISOString(),
    isCurrentMonth: isSameMonth(day, cursor),
    isToday: isSameDay(day, new Date()),
    events: [],
  }));
  const days = monthData?.days ?? fallbackDays;

  const matchesFilter = (eventItem: { type: string; projectCode: string; title: string; projectName?: string }) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q.length === 0 ||
      eventItem.projectCode.toLowerCase().includes(q) ||
      eventItem.title.toLowerCase().includes(q) ||
      (eventItem.projectName ?? "").toLowerCase().includes(q) ||
      TYPE_CONF[eventItem.type]?.label.toLowerCase().includes(q);
    const matchesType = typeFilter === "all" || eventItem.type === typeFilter;
    return matchesQuery && matchesType;
  };

  const filteredDays = useMemo(
    () =>
      days.map((day) => ({
        ...day,
        events: day.events.filter((eventItem) => matchesFilter(eventItem)),
      })),
    [days, query, typeFilter],
  );

  const filteredUpcoming = useMemo(
    () => upcoming.filter((eventItem) => matchesFilter(eventItem)),
    [upcoming, query, typeFilter],
  );

  return (
    <div className="p-6 lg:p-8 space-y-5 max-w-[1500px] mx-auto animate-fade-in">
      <div className="flex items-end justify-between flex-wrap gap-3 animate-slide-in-down">
        <div>
          <div className="text-[11px] tracking-[0.25em] text-accent uppercase font-mono">Kalendari ekzekutiv</div>
          <h1 className="font-display text-3xl font-medium mt-1">Nisja dhe mbyllja e projekteve</h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {Object.entries(TYPE_CONF).map(([k, v]) => <span key={k} className={cn("inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded border font-mono uppercase tracking-wider", v.cls)}>{v.label}</span>)}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_220px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Kërko projekt, kod ose ngjarje..." className="pl-9 bg-background border-border" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
          <option value="all">Të gjitha ngjarjet</option>
          <option value="kickoff">Nisja e projektit</option>
          <option value="completion">Mbyllja e projektit</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,340px] gap-4">
        <div className="rounded-lg border border-border bg-surface shadow-elev animate-scale-in hover:shadow-glow transition-all duration-300">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="font-display text-xl capitalize">{format(cursor, "MMMM yyyy", { locale: sq })}</div>
            <div className="flex items-center gap-1">
              <button onClick={() => setCursor(addMonths(cursor, -1))} className="p-2 rounded hover:bg-surface-hover text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" /></button>
              <button onClick={() => setCursor(new Date())} className="px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider text-accent hover:bg-surface-hover">Sot</button>
              <button onClick={() => setCursor(addMonths(cursor, 1))} className="p-2 rounded hover:bg-surface-hover text-muted-foreground hover:text-foreground"><ChevronRight className="size-4" /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-border">
            {WEEKDAYS.map((d) => <div key={d} className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-muted-foreground border-r last:border-r-0 border-border">{d}</div>)}
          </div>

          <div className="grid grid-cols-7">
            {filteredDays.map((day, i) => {
              const currentDate = new Date(day.date);
              return (
                <div key={i} className={cn("min-h-[120px] p-2 border-r border-b border-border last:border-r-0 [&:nth-child(7n)]:border-r-0", !day.isCurrentMonth && "bg-background/50")}>
                  <div className={cn("inline-flex items-center justify-center size-6 rounded-full text-xs font-mono", day.isToday ? "bg-accent text-accent-foreground font-semibold" : day.isCurrentMonth ? "text-foreground" : "text-muted-foreground/40")}>{format(currentDate, "d")}</div>
                  <div className="mt-1 space-y-1">
                    {day.events.map((eventItem) => {
                      const conf = TYPE_CONF[eventItem.type];
                      return <div key={eventItem.eventId} className={cn("text-[10px] leading-tight px-1.5 py-1 rounded border", conf.cls)} title={`${eventItem.projectCode} — ${eventItem.title}`}><span className="font-mono">{eventItem.projectCode}</span> · {eventItem.title}</div>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface shadow-elev animate-scale-in hover:shadow-glow transition-all duration-300">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-4 text-accent" />
              <div className="font-display text-base font-medium">Ngjarjet e ardhshme</div>
            </div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{filteredUpcoming.length} ngjarje</div>
          </div>
          <div className="p-3 space-y-2">
            {filteredUpcoming.map((eventItem) => {
              const conf = TYPE_CONF[eventItem.type];
              return (
                <div key={eventItem.id} className="p-3 rounded-md bg-surface-elevated border border-border animate-slide-in-up transition-all duration-300 hover:border-border-strong hover:-translate-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded border font-mono uppercase tracking-wider", conf.cls)}>{conf.label}</span>
                    <span className="text-[11px] font-mono text-muted-foreground">{format(new Date(eventItem.date), "dd MMM", { locale: sq })}</span>
                  </div>
                  <div className="text-sm font-medium mt-2 leading-snug">{eventItem.title}</div>
                  <div className="text-[11px] font-mono text-muted-foreground mt-1">{eventItem.projectCode} · {eventItem.projectName}</div>
                </div>
              );
            })}
            {filteredUpcoming.length === 0 && (
              <div className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                Nuk ka ngjarje që përputhen me kërkimin ose filtrin.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


