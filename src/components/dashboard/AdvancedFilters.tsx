import { useState } from "react";
import { X, Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterState {
  status: string[];
  risk: string[];
  ministry: string[];
  progress: [number, number];
  dateRange: string;
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

const statuses = ["active", "in_progress", "completed", "blocked", "at_risk", "planning"];
const risks = ["low", "medium", "high", "critical"];
const dateRanges = ["today", "week", "month", "quarter", "year", "custom"];

const statusLabels: Record<string, string> = {
  active: "Aktive",
  in_progress: "Në proces",
  completed: "Përfunduar",
  blocked: "Bllokuar",
  at_risk: "Në risk",
  planning: "Planifikim",
};

const riskLabels: Record<string, string> = {
  low: "I ulët",
  medium: "Mesatar",
  high: "I lartë",
  critical: "Kritik",
};

const dateRangeLabels: Record<string, string> = {
  today: "Sot",
  week: "Këtë javë",
  month: "Këtë muaj",
  quarter: "Këtë tremujor",
  year: "Këtë vit",
  custom: "Personalizuar",
};

export function AdvancedFilters({ onFiltersChange }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    risk: [],
    ministry: [],
    progress: [0, 100],
    dateRange: "month",
  });

  const handleStatusToggle = (status: string) => {
    const updated = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    
    const newFilters = { ...filters, status: updated };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleRiskToggle = (risk: string) => {
    const updated = filters.risk.includes(risk)
      ? filters.risk.filter((r) => r !== risk)
      : [...filters.risk, risk];
    
    const newFilters = { ...filters, risk: updated };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleProgressChange = (index: number, value: number) => {
    const newProgress: [number, number] = [...filters.progress] as [number, number];
    newProgress[index] = value;
    
    const newFilters = { ...filters, progress: newProgress };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterState = {
      status: [],
      risk: [],
      ministry: [],
      progress: [0, 100],
      dateRange: "month",
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const activeFilterCount = filters.status.length + filters.risk.length;

  return (
    <div className="relative animate-slide-in-right">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md border transition-all hover:bg-surface-hover animate-scale-in",
          isOpen ? "border-accent bg-surface-elevated text-accent" : "border-border bg-surface text-muted-foreground hover:text-foreground"
        )}
      >
        <Filter className="size-4" />
        <ChevronDown className={cn("size-3 transition-transform", isOpen && "rotate-180")} />
        {activeFilterCount > 0 && (
          <span className="ml-1 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium animate-pulse-soft">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-surface border border-border rounded-lg shadow-elev p-4 z-50 animate-scale-in origin-top-right space-y-4">
          {/* Status Filter */}
          <div className="animate-slide-in-down" style={{ animationDelay: "50ms" }}>
            <h4 className="text-xs font-medium text-foreground mb-2 uppercase tracking-wider">Statusi</h4>
            <div className="flex flex-wrap gap-1.5">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusToggle(status)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium transition-all hover:scale-105 animate-fade-in",
                    filters.status.includes(status)
                      ? "bg-accent text-accent-foreground"
                      : "bg-surface-elevated text-muted-foreground hover:text-foreground"
                  )}
                >
                  {statusLabels[status]}
                </button>
              ))}
            </div>
          </div>

          {/* Risk Filter */}
          <div className="animate-slide-in-down" style={{ animationDelay: "100ms" }}>
            <h4 className="text-xs font-medium text-foreground mb-2 uppercase tracking-wider">Risku</h4>
            <div className="flex flex-wrap gap-1.5">
              {risks.map((risk) => (
                <button
                  key={risk}
                  onClick={() => handleRiskToggle(risk)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium transition-all hover:scale-105 animate-fade-in",
                    filters.risk.includes(risk)
                      ? "bg-accent text-accent-foreground"
                      : "bg-surface-elevated text-muted-foreground hover:text-foreground"
                  )}
                >
                  {riskLabels[risk]}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Range */}
          <div className="animate-slide-in-down" style={{ animationDelay: "150ms" }}>
            <h4 className="text-xs font-medium text-foreground mb-2 uppercase tracking-wider">Progresi (%)</h4>
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.progress[0]}
                  onChange={(e) => handleProgressChange(0, Number(e.target.value))}
                  className="flex-1 h-1 bg-surface-elevated rounded-lg appearance-none cursor-pointer transition-all hover:bg-surface-hover"
                />
                <span className="text-xs font-mono text-muted-foreground w-8 text-right">{filters.progress[0]}%</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.progress[1]}
                  onChange={(e) => handleProgressChange(1, Number(e.target.value))}
                  className="flex-1 h-1 bg-surface-elevated rounded-lg appearance-none cursor-pointer transition-all hover:bg-surface-hover"
                />
                <span className="text-xs font-mono text-muted-foreground w-8 text-right">{filters.progress[1]}%</span>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="animate-slide-in-down" style={{ animationDelay: "200ms" }}>
            <h4 className="text-xs font-medium text-foreground mb-2 uppercase tracking-wider">Periudha</h4>
            <select
              value={filters.dateRange}
              onChange={(e) => {
                const newFilters = { ...filters, dateRange: e.target.value };
                setFilters(newFilters);
                onFiltersChange(newFilters);
              }}
              className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            >
              {dateRanges.map((range) => (
                <option key={range} value={range}>
                  {dateRangeLabels[range]}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Button */}
          <button
            onClick={handleClearFilters}
            className={cn(
              "w-full px-3 py-2 rounded-md text-sm font-medium transition-all hover:bg-destructive/20 hover:text-destructive animate-slide-in-down hover:scale-105",
              activeFilterCount > 0
                ? "bg-destructive/10 text-destructive cursor-pointer"
                : "bg-surface-elevated text-muted-foreground cursor-not-allowed opacity-50"
            )}
            disabled={activeFilterCount === 0}
          >
            <span className="flex items-center justify-center gap-2">
              <X className="size-4" />
              Fshij Filtrat
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
