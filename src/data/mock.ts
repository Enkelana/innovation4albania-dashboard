import type { Project, ProjectEvent, User } from "@/types";

export const MINISTRIES = [
  "Ministria e Infrastrukturës dhe Energjisë",
  "Ministria e Ekonomisë, Kulturës dhe Inovacionit",
  "Ministria e Financave",
  "Ministria e Arsimit, Sportit dhe Rinisë",
  "Ministria e Shëndetësisë dhe Mbrojtjes Sociale",
  "Ministria e Bujqësisë dhe Zhvillimit Rural",
  "Ministria e Drejtësisë",
  "Ministria e Brendshme",
];

export const USERS: User[] = [
  { id: "u1", name: "Edi Rama", role: "kryeminister" },
  { id: "u2", name: "Belinda Balluku", role: "minister", ministry: MINISTRIES[0] },
  { id: "u3", name: "Blendi Gonxhja", role: "minister", ministry: MINISTRIES[1] },
  { id: "u4", name: "Arjan Ymeri", role: "drejtor_agjencie", ministry: MINISTRIES[1] },
  { id: "u5", name: "Erblin Malkurti", role: "staf_agjencie", ministry: MINISTRIES[1] },
  { id: "u6", name: "Ina Peleshka", role: "staf_ministrie", ministry: MINISTRIES[0] },
];

const okrAvg = (o: Project["okr"]) =>
  Math.round((o.deadlines + o.budget + o.quality + o.impact + o.collaboration) / 5);

const today = new Date();
const iso = (offsetDays: number) => {
  const d = new Date(today); d.setDate(d.getDate() + offsetDays); return d.toISOString();
};

const raw: Omit<Project, "lastUpdated">[] = [
  {
    id: "p1", code: "ASHSH-2024",
    name: "ASHSH — Akademia e Shkencave Shqiptare (Modernizimi)",
    description: "Transformimi dixhital dhe restaurimi i infrastrukturës shkencore.",
    ministries: [MINISTRIES[0], MINISTRIES[1]],
    agency: "ASHSH",
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
    name: "e-Albania 3.0 — Platforma Kombëtare",
    description: "Brez i ri shërbimesh dixhitale për qytetarët dhe bizneset.",
    ministries: [MINISTRIES[1]],
    status: "active",
    totalPhases: 8, currentPhase: 5,
    startDate: iso(-310), endDate: iso(95),
    progress: 62,
    okr: { deadlines: 88, budget: 82, quality: 90, impact: 92, collaboration: 85 },
    risk: "low",
    team: ["Aida Hoxha", "Genti Beqiri", "Mira Kola"],
    lead: "Aida Hoxha", updateCadenceDays: 7, budgetMln: 28.0,
  },
  {
    id: "p3", code: "RR-DUR-2025",
    name: "Korridori Tiranë–Durrës (Faza II)",
    description: "Zgjerim 6 korsi, ura të reja dhe sistem inteligjent trafiku.",
    ministries: [MINISTRIES[0]],
    status: "at_risk",
    totalPhases: 12, currentPhase: 4,
    startDate: iso(-180), endDate: iso(420),
    progress: 33,
    okr: { deadlines: 45, budget: 55, quality: 70, impact: 80, collaboration: 60 },
    risk: "high",
    team: ["Bledar Kurti", "Sokol Marku", "Ardit Hoxha"],
    lead: "Bledar Kurti", updateCadenceDays: 14, budgetMln: 145,
  },
  {
    id: "p4", code: "EDU-DIG-22",
    name: "Shkolla Dixhitale — 1200 institucione",
    description: "Pajisje, lidhje fibër dhe trajnim mësuesish.",
    ministries: [MINISTRIES[3]],
    status: "in_progress",
    totalPhases: 6, currentPhase: 5,
    startDate: iso(-400), endDate: iso(60),
    progress: 84,
    okr: { deadlines: 92, budget: 88, quality: 86, impact: 95, collaboration: 90 },
    risk: "low",
    team: ["Eriona Cuko", "Marsel Beqo"],
    lead: "Eriona Cuko", updateCadenceDays: 7, budgetMln: 42,
  },
  {
    id: "p5", code: "HEA-ONC-01",
    name: "Spitali Onkologjik — Pajisje të reja",
    description: "Modernizim i pajisjeve diagnostikuese dhe terapeutike.",
    ministries: [MINISTRIES[4], MINISTRIES[2]],
    status: "completed",
    totalPhases: 5, currentPhase: 5,
    startDate: iso(-560), endDate: iso(-30),
    progress: 100,
    okr: { deadlines: 95, budget: 92, quality: 97, impact: 98, collaboration: 90 },
    risk: "low",
    team: ["Dr. Pjetri", "Dr. Hoxha", "Dr. Kola"],
    lead: "Dr. Pjetri", updateCadenceDays: 14, budgetMln: 18.6,
  },
  {
    id: "p6", code: "AGR-RUR-09",
    name: "100 fshatra — Rilindja Rurale",
    description: "Rrjet rrugor lokal, agroturizëm dhe pikë grumbullimi.",
    ministries: [MINISTRIES[5]],
    status: "in_progress",
    totalPhases: 10, currentPhase: 6,
    startDate: iso(-260), endDate: iso(220),
    progress: 58,
    okr: { deadlines: 70, budget: 78, quality: 75, impact: 85, collaboration: 72 },
    risk: "medium",
    team: ["Arben Sula", "Lulzim Basha", "Vera Marku"],
    lead: "Arben Sula", updateCadenceDays: 14, budgetMln: 64,
  },
  {
    id: "p7", code: "JUS-MOD-04",
    name: "Modernizimi i Sistemit Gjyqësor",
    description: "Dosje elektronike, seanca virtuale, transparencë totale.",
    ministries: [MINISTRIES[6]],
    status: "in_progress",
    totalPhases: 7, currentPhase: 3,
    startDate: iso(-150), endDate: iso(310),
    progress: 38,
    okr: { deadlines: 60, budget: 70, quality: 72, impact: 78, collaboration: 65 },
    risk: "medium",
    team: ["Erion Braçe", "Klodiana Lala"],
    lead: "Erion Braçe", updateCadenceDays: 14, budgetMln: 9.4,
  },
  {
    id: "p8", code: "ENE-HID-12",
    name: "Hidrocentrali Skavica",
    description: "Studim fizibiliteti dhe fillim ndërtimi.",
    ministries: [MINISTRIES[0], MINISTRIES[2]],
    status: "at_risk",
    totalPhases: 15, currentPhase: 2,
    startDate: iso(-90), endDate: iso(1500),
    progress: 12,
    okr: { deadlines: 35, budget: 42, quality: 60, impact: 88, collaboration: 50 },
    risk: "critical",
    team: ["Eqerem Hoxha", "Donika Kurti"],
    lead: "Eqerem Hoxha", updateCadenceDays: 14, budgetMln: 980,
  },
  {
    id: "p9", code: "BRE-ID-05",
    name: "Karta Biometrike e Re",
    description: "Brez i ri kartash me çip dhe shërbime dixhitale.",
    ministries: [MINISTRIES[7]],
    status: "completed",
    totalPhases: 6, currentPhase: 6,
    startDate: iso(-700), endDate: iso(-90),
    progress: 100,
    okr: { deadlines: 90, budget: 85, quality: 92, impact: 88, collaboration: 87 },
    risk: "low",
    team: ["Florian Topi", "Anila Hoxha"],
    lead: "Florian Topi", updateCadenceDays: 14, budgetMln: 22,
  },
  {
    id: "p10", code: "TUR-VIS-08",
    name: "Vizioni i Bregdetit Shqiptar",
    description: "Plan urbanistik dhe investime në Vlorë–Sarandë.",
    ministries: [MINISTRIES[1], MINISTRIES[5]],
    status: "cancelled",
    totalPhases: 9, currentPhase: 3,
    startDate: iso(-420), endDate: iso(-60),
    progress: 28,
    okr: { deadlines: 40, budget: 30, quality: 50, impact: 60, collaboration: 35 },
    risk: "high",
    team: ["Ervis Martinaj", "Suela Doda"],
    lead: "Ervis Martinaj", updateCadenceDays: 14, budgetMln: 35,
  },
  {
    id: "p11", code: "FIN-TAX-03",
    name: "Reforma e Administratës Tatimore",
    description: "Sistem i ri TI, fatura elektronike, audit i automatizuar.",
    ministries: [MINISTRIES[2]],
    status: "in_progress",
    totalPhases: 8, currentPhase: 6,
    startDate: iso(-340), endDate: iso(120),
    progress: 76,
    okr: { deadlines: 85, budget: 90, quality: 82, impact: 88, collaboration: 80 },
    risk: "low",
    team: ["Niko Peleshi", "Olta Xhaçka"],
    lead: "Niko Peleshi", updateCadenceDays: 7, budgetMln: 15.2,
  },
  {
    id: "p12", code: "INF-5G-01",
    name: "Rrjeti 5G Kombëtar",
    description: "Mbulim kombëtar 5G dhe rregullim spektri.",
    ministries: [MINISTRIES[0], MINISTRIES[1]],
    status: "in_progress",
    totalPhases: 7, currentPhase: 2,
    startDate: iso(-60), endDate: iso(540),
    progress: 22,
    okr: { deadlines: 65, budget: 80, quality: 78, impact: 90, collaboration: 70 },
    risk: "medium",
    team: ["Endri Shabani", "Klejda Shehu"],
    lead: "Endri Shabani", updateCadenceDays: 7, budgetMln: 220,
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

// Events
export const EVENTS: ProjectEvent[] = [
  { id: "e1", projectId: "p1", date: iso(-12), type: "kickoff", title: "Kickoff faza 7" },
  { id: "e2", projectId: "p1", date: iso(3),   type: "meeting", title: "Steering committee" },
  { id: "e3", projectId: "p1", date: iso(14),  type: "deadline", title: "Dorëzim raport mes-fazor" },
  { id: "e4", projectId: "p2", date: iso(1),   type: "delivery", title: "Release v3.0 RC" },
  { id: "e5", projectId: "p2", date: iso(8),   type: "meeting", title: "User testing — qytetarë" },
  { id: "e6", projectId: "p3", date: iso(-4),  type: "deadline", title: "Dorëzim DRP" },
  { id: "e7", projectId: "p4", date: iso(20),  type: "delivery", title: "Mbyllje shkollat e fundit" },
  { id: "e8", projectId: "p6", date: iso(6),   type: "meeting", title: "Vizitë në terren — Pukë" },
  { id: "e9", projectId: "p7", date: iso(11),  type: "kickoff", title: "Faza 4 — Gjykata e Apelit" },
  { id: "e10", projectId: "p8", date: iso(2),  type: "meeting", title: "Konsultim publik" },
  { id: "e11", projectId: "p11", date: iso(5), type: "deadline", title: "Go-live faturim e-Tax" },
  { id: "e12", projectId: "p12", date: iso(17), type: "kickoff", title: "Pilot Tirana 5G" },
  { id: "e13", projectId: "p3", date: iso(25), type: "meeting", title: "Bordi i kontraktorëve" },
  { id: "e14", projectId: "p2", date: iso(-3), type: "delivery", title: "API Gateway v2" },
];
