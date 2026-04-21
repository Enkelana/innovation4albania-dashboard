export type Role = "kryeminister" | "minister" | "drejtor_agjencie" | "staf_agjencie" | "staf_ministrie";

export type ProjectStatus = "active" | "in_progress" | "completed" | "cancelled" | "at_risk";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type PerformanceBucket = "excellent" | "good" | "needs_attention" | "critical";

export interface OKR {
  deadlines: number;     // Afatet
  budget: number;        // Buxheti
  quality: number;       // Cilësia
  impact: number;        // Impakti
  collaboration: number; // Bashkëpunimi
}

export interface ProjectEvent {
  id: string;
  projectId: string;
  date: string; // ISO
  type: "kickoff" | "meeting" | "deadline" | "delivery";
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
  progress: number; // 0-100
  okr: OKR;
  risk: RiskLevel;
  team: string[];
  lead: string;
  lastUpdated: string;     // ISO
  updateCadenceDays: 7 | 14;
  budgetMln: number;       // EUR mln
}

export interface User {
  id: string;
  name: string;
  role: Role;
  ministry?: string;
  avatar?: string;
}
