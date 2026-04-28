import type { Project, ProjectEvent, User } from "@/types";

export const MINISTRIES = [
  "Ministria e InfrastrukturÃ«s dhe EnergjisÃ«",
  "Ministria e EkonomisÃ«, KulturÃ«s dhe Inovacionit",
  "Ministria e Financave",
  "Ministria e Arsimit, Sportit dhe RinisÃ«",
  "Ministria e ShÃ«ndetÃ«sisÃ« dhe Mbrojtjes Sociale",
  "Ministria e BujqÃ«sisÃ« dhe Zhvillimit Rural",
  "Ministria e DrejtÃ«sisÃ«",
  "Ministria e Brendshme",
];

const okrAvg = (o: Project["okr"]) =>
  Math.round((o.deadlines + o.budget + o.quality + o.impact + o.collaboration) / 5);

const today = new Date();
const iso = (offsetDays: number) => {
  const d = new Date(today); d.setDate(d.getDate() + offsetDays); return d.toISOString();
};

const raw: Omit<Project, "lastUpdated">[] = [
  {
    id: "p1", code: "ASSHP-2024",
    name: "ASSHP â€” AGJENCIA SHTETÃ‹RORE PÃ‹R SHPRONÃ‹SIMIN (Modernizimi)",
    description: "Transformimi dixhital dhe restaurimi i infrastrukturÃ«s shkencore.",
    ministries: [MINISTRIES[0], MINISTRIES[1]],
    agency: "ASSHP",
    status: "in_progress",
    totalPhases: 10, currentPhase: 7,
    startDate: iso(-220), endDate: iso(140),
    progress: 70,
    okr: { deadlines: 80, budget: 90, quality: 75, impact: 70, collaboration: 95 },
    risk: "medium",
    team: ["Erblin Malkurti", "Evilsidio Tosku", "Nensi Ahmetbeja", "Ina Peleshka"],
    lead: "Erblin Malkurti",
    updateCadenceDays: 7, budgetMln: 12.5,
  },
  {
    id: "p2", code: "E-ALB-001",
    name: "Projekt 2",
    description: "PÃ«rshkrim i pÃ«rgjithshÃ«m i projektit.",
    ministries: ["â€”"],
    status: "active",
    totalPhases: 8, currentPhase: 5,
    startDate: iso(-310), endDate: iso(95),
    progress: 62,
    okr: { deadlines: 88, budget: 82, quality: 90, impact: 92, collaboration: 85 },
    risk: "low",
    team: ["â€”", "â€”", "â€”"],
    lead: "â€”", updateCadenceDays: 7, budgetMln: 28.0,
  },
  {
    id: "p3", code: "RR-DUR-2025",
    name: "Projekt 3",
    description: "PÃ«rshkrim i pÃ«rgjithshÃ«m i projektit.",
    ministries: ["â€”"],
    status: "at_risk",
    totalPhases: 12, currentPhase: 4,
    startDate: iso(-180), endDate: iso(420),
    progress: 33,
    okr: { deadlines: 45, budget: 55, quality: 70, impact: 80, collaboration: 60 },
    risk: "high",
    team: ["â€”", "â€”", "â€”"],
    lead: "â€”", updateCadenceDays: 14, budgetMln: 145,
  },
  {
    id: "p4", code: "EDU-DIG-22",
    name: "Projekt 4",
    description: "PÃ«rshkrim i pÃ«rgjithshÃ«m i projektit.",
    ministries: ["â€”"],
    status: "in_progress",
    totalPhases: 6, currentPhase: 5,
    startDate: iso(-400), endDate: iso(60),
    progress: 84,
    okr: { deadlines: 92, budget: 88, quality: 86, impact: 95, collaboration: 90 },
    risk: "low",
    team: ["â€”", "â€”"],
    lead: "â€”", updateCadenceDays: 7, budgetMln: 42,
  },
  {
    id: "p5", code: "HEA-ONC-01",
    name: "Projekt 5",
    description: "PÃ«rshkrim i pÃ«rgjithshÃ«m i projektit.",
    ministries: ["â€”"],
    status: "completed",
    totalPhases: 5, currentPhase: 5,
    startDate: iso(-560), endDate: iso(-30),
    progress: 100,
    okr: { deadlines: 95, budget: 92, quality: 97, impact: 98, collaboration: 90 },
    risk: "low",
    team: ["â€”", "â€”", "â€”"],
    lead: "â€”", updateCadenceDays: 14, budgetMln: 18.6,
  },
  {
    id: "p6", code: "AGR-RUR-09",
    name: "Projekt 6",
    description: "PÃ«rshkrim i pÃ«rgjithshÃ«m i projektit.",
    ministries: ["â€”"],
    status: "in_progress",
    totalPhases: 10, currentPhase: 6,
    startDate: iso(-260), endDate: iso(220),
    progress: 58,
    okr: { deadlines: 70, budget: 78, quality: 75, impact: 85, collaboration: 72 },
    risk: "medium",
    team: ["â€”", "â€”", "â€”"],
    lead: "â€”", updateCadenceDays: 14, budgetMln: 64,
  },
  {
    id: "p7", code: "JUS-MOD-04",
    name: "Projekt 7",
    description: "PÃ«rshkrim i pÃ«rgjithshÃ«m i projektit.",
    ministries: ["â€”"],
    status: "in_progress",
    totalPhases: 7, currentPhase: 3,
    startDate: iso(-150), endDate: iso(310),
    progress: 38,
    okr: { deadlines: 60, budget: 70, quality: 72, impact: 78, collaboration: 65 },
    risk: "medium",
    team: ["â€”", "â€”"],
    lead: "â€”", updateCadenceDays: 14, budgetMln: 9.4,
  },
  {
    id: "p8", code: "ENE-HID-12",
    name: "Projekt 8",
    description: "PÃ«rshkrim i pÃ«rgjithshÃ«m i projektit.",
    ministries: ["â€”"],
    status: "at_risk",
    totalPhases: 15, currentPhase: 2,
    startDate: iso(-90), endDate: iso(1500),
    progress: 12,
    okr: { deadlines: 35, budget: 42, quality: 60, impact: 88, collaboration: 50 },
    risk: "critical",
    team: ["â€”", "â€”"],
    lead: "â€”", updateCadenceDays: 14, budgetMln: 980,
  },
  {
    id: "p9", code: "BRE-ID-05",
    name: "Projekt 9",
    description: "PÃ«rshkrim i pÃ«rgjithshÃ«m i projektit.",
    ministries: ["â€”"],
    status: "completed",
    totalPhases: 6, currentPhase: 6,
    startDate: iso(-700), endDate: iso(-90),
    progress: 100,
    okr: { deadlines: 90, budget: 85, quality: 92, impact: 88, collaboration: 87 },
    risk: "low",
    team: ["â€”", "â€”"],
    lead: "â€”", updateCadenceDays: 14, budgetMln: 22,
  },
  {
    id: "p10", code: "TUR-VIS-08",
    name: "Projekt 10",
    description: "PÃ«rshkrim i pÃ«rgjithshÃ«m i projektit.",
    ministries: ["â€”"],
    status: "cancelled",
    totalPhases: 9, currentPhase: 3,
    startDate: iso(-420), endDate: iso(-60),
    progress: 28,
    okr: { deadlines: 40, budget: 30, quality: 50, impact: 60, collaboration: 35 },
    risk: "high",
    team: ["â€”", "â€”"],
    lead: "â€”", updateCadenceDays: 14, budgetMln: 35,
  },
  {
    id: "p11", code: "FIN-TAX-03",
    name: "Projekt 11",
    description: "PÃ«rshkrim i pÃ«rgjithshÃ«m i projektit.",
    ministries: ["â€”"],
    status: "in_progress",
    totalPhases: 8, currentPhase: 6,
    startDate: iso(-340), endDate: iso(120),
    progress: 76,
    okr: { deadlines: 85, budget: 90, quality: 82, impact: 88, collaboration: 80 },
    risk: "low",
    team: ["â€”", "â€”"],
    lead: "â€”", updateCadenceDays: 7, budgetMln: 15.2,
  },
  {
    id: "p12", code: "INF-5G-01",
    name: "Projekt 12",
    description: "PÃ«rshkrim i pÃ«rgjithshÃ«m i projektit.",
    ministries: ["â€”"],
    status: "in_progress",
    totalPhases: 7, currentPhase: 2,
    startDate: iso(-60), endDate: iso(540),
    progress: 22,
    okr: { deadlines: 65, budget: 80, quality: 78, impact: 90, collaboration: 70 },
    risk: "medium",
    team: ["â€”", "â€”"],
    lead: "â€”", updateCadenceDays: 7, budgetMln: 220,
  },
];

// Last update offsets to trigger overdue logic
const lastUpdateOffsets: Record<string, number> = {
  p1: -5, p2: -2, p3: -22, p4: -3, p5: -10, p6: -16,
  p7: -19, p8: -28, p9: -45, p10: -90, p11: -1, p12: -6,
};

export const PROJECTS: Project[] = raw.map(p => ({
  ...p, lastUpdated: iso(lastUpdateOffsets[p.id] ?? -3),
}));

export const okrAverage = okrAvg;

export function isOverdue(p: Project): boolean {
  if (p.status === "completed" || p.status === "cancelled") return false;
  const last = new Date(p.lastUpdated).getTime();
  const now = Date.now();
  const days = (now - last) / (1000 * 60 * 60 * 24);
  return days > p.updateCadenceDays;
}

export function performanceBucket(score: number): "excellent" | "good" | "needs_attention" | "critical" {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 55) return "needs_attention";
  return "critical";
}

export function visibleProjectsForUser(user: User | null): Project[] {
  if (!user) return [];
  if (user.role !== "staf_ministrie") return PROJECTS;
  if (!user.ministry) return [];
  return PROJECTS.filter(p => p.ministries.includes(user.ministry!));
}

// Events
export const EVENTS: ProjectEvent[] = [
  { id: "e1", projectId: "p1", date: iso(-12), type: "kickoff", title: "Kickoff faza 7" },
  { id: "e2", projectId: "p1", date: iso(3),   type: "meeting", title: "Komiteti drejtues" },
  { id: "e3", projectId: "p1", date: iso(14),  type: "deadline", title: "DorÃ«zim raporti mes-fazor" },
  { id: "e4", projectId: "p2", date: iso(1),   type: "delivery", title: "LÃ«shim versioni v3.0 RC" },
  { id: "e5", projectId: "p2", date: iso(8),   type: "meeting", title: "Testim me pÃ«rdorues â€” qytetarÃ«" },
  { id: "e6", projectId: "p3", date: iso(-4),  type: "deadline", title: "DorÃ«zim DRP" },
  { id: "e7", projectId: "p4", date: iso(20),  type: "delivery", title: "Mbyllje e shkollave tÃ« fundit" },
  { id: "e8", projectId: "p6", date: iso(6),   type: "meeting", title: "VizitÃ« nÃ« terren â€” PukÃ«" },
  { id: "e9", projectId: "p7", date: iso(11),  type: "kickoff", title: "Faza 4 â€” Gjykata e Apelit" },
  { id: "e10", projectId: "p8", date: iso(2),  type: "meeting", title: "Konsultim publik" },
  { id: "e11", projectId: "p11", date: iso(5), type: "deadline", title: "VÃ«nie nÃ« punÃ« faturimi e-Tax" },
  { id: "e12", projectId: "p12", date: iso(17), type: "kickoff", title: "Pilot Tirana 5G" },
  { id: "e13", projectId: "p3", date: iso(25), type: "meeting", title: "Bordi i kontraktorÃ«ve" },
  { id: "e14", projectId: "p2", date: iso(-3), type: "delivery", title: "PortÃ« API v2" },
];

