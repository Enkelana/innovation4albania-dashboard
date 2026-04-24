export type Role = "kryeminister" | "minister" | "drejtor_agjencie" | "drejtor_inovacioni_publik" | "staf_agjencie" | "staf_ministrie";

export type ProjectStatus =
  | "planning"
  | "active"
  | "at_risk"
  | "blocked"
  | "completed"
  | "cancelled";

export type RiskLevel = "low" | "medium" | "high" | "critical";
export type PerformanceBucket = "excellent" | "good" | "needs_attention" | "critical";
export type EventType = "kickoff" | "completion";

export interface OKR {
  deadlines: number;
  quality: number;
  impact: number;
  collaboration: number;
}

export interface KeyResult {
  id: string;
  title: string;
  progress: number;
  target: number;
  unit: string;
}

export interface Objective {
  id: string;
  title: string;
  owner: string;
  progress: number;
  keyResults: KeyResult[];
}

export interface ProjectEvent {
  id: string;
  projectId: string;
  date: string;
  type: EventType;
  title: string;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  description: string;
  ministries: string[];
  agency?: string;
  status: ProjectStatus;
  totalPhases: number;
  currentPhase: number;
  startDate: string;
  endDate: string;
  progress: number;
  expectedProgress: number;
  deviationPercent: number;
  daysRemaining: number;
  delayDays: number;
  okr: OKR;
  risk: RiskLevel;
  team: string[];
  lead: string;
  lastUpdated: string;
  updateCadenceDays: number;
  okrAverage: number;
  isOverdue: boolean;
  objectives: Objective[];
}

export interface User {
  id: string;
  name: string;
  role: Role;
  ministry?: string;
  roleLabel?: string;
}

export interface StatusCard {
  key: ProjectStatus;
  label: string;
  value: number;
  color: string;
}

export interface PortfolioMetrics {
  averageOkr: number;
  onTimePercentage: number;
  deviationAverage: number;
  projectsNeedingAttention: number;
}

export interface DashboardSummary {
  totalProjects: number;
  statusCards: StatusCard[];
  portfolio: PortfolioMetrics;
}

export interface StatusDistributionItem {
  status: ProjectStatus;
  label: string;
  value: number;
  color: string;
}

export interface MinistryDistributionItem {
  ministry: string;
  value: number;
  color: string;
}

export interface PerformanceScoreItem {
  projectId: string;
  code: string;
  name: string;
  score: number;
  progress: number;
  risk: RiskLevel;
}

export interface TrendPoint {
  label: string;
  progress: number;
  okr: number;
}

export interface PerformanceBoardColumn {
  key: PerformanceBucket;
  label: string;
  hint: string;
  items: PerformanceScoreItem[];
}

export interface CalendarDayEvent {
  eventId: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  type: EventType;
  typeLabel: string;
  title: string;
}

export interface CalendarDay {
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarDayEvent[];
}

export interface CalendarMonthResponse {
  cursorMonth: string;
  gridStart: string;
  gridEnd: string;
  days: CalendarDay[];
}

export interface UpcomingEvent {
  id: string;
  projectId: string;
  date: string;
  type: EventType;
  typeLabel: string;
  title: string;
  projectCode: string;
  projectName: string;
}

export interface AiInsight {
  projectId: string;
  attentionLevel: "normal" | "medium" | "high" | "critical";
  summary: string;
  riskExplanation: string;
  confidenceScore: number;
  positiveSignals: string[];
  concerns: string[];
  recommendations: string[];
}

export interface PortfolioOkrResponse {
  metrics: PortfolioMetrics;
  objectives: Objective[];
}

export interface RiskDeviationItem {
  projectId: string;
  projectCode: string;
  projectName: string;
  status: string;
  risk: string;
  currentProgress: number;
  expectedProgress: number;
  deviationPercent: number;
  daysRemaining: number;
  delayDays: number;
  urgency: string;
}

export interface WeeklyUpdate {
  id: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  submittedBy: string;
  submittedRole: string;
  submittedAt: string;
  progress: number;
  status: string;
  okrAverage: number;
  risk: string;
  blockers: string;
  comments: string;
}

export interface ProjectChangeProposal {
  id: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  submittedBy: string;
  submittedRole: string;
  submittedAt: string;
  type: "deadline" | "content";
  typeLabel: string;
  currentValue: string;
  proposedValue: string;
  reason: string;
  status: string;
}

export interface CreateProjectChangeProposalPayload {
  projectId: string;
  type: "deadline" | "content";
  currentValue: string;
  proposedValue: string;
  reason: string;
}
export interface ChatMessage {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

export interface AiChatResponse {
  reply: ChatMessage;
  suggestedActions: string[];
}

export interface CreateProjectPayload {
  code: string;
  name: string;
  description: string;
  ministries: string[];
  agency?: string;
  status: ProjectStatus;
  totalPhases: number;
  currentPhase: number;
  startDate: string;
  endDate: string;
  progress: number;
  okr: OKR;
  risk: RiskLevel;
  team: string[];
  lead: string;
  updateCadenceDays: number;
  objectives: Array<{
    title: string;
    owner: string;
    keyResults: Array<{
      title: string;
      progress: number;
      target: number;
      unit: string;
    }>;
  }>;
}

export interface CreatePortfolioObjectivePayload {
  title: string;
  owner: string;
  keyResults: Array<{
    title: string;
    progress: number;
    target: number;
    unit: string;
  }>;
}

export interface CreateWeeklyUpdatePayload {
  projectId: string;
  progress: number;
  status: ProjectStatus;
  okr: OKR;
  risk: RiskLevel;
  blockers: string;
  comments: string;
}






