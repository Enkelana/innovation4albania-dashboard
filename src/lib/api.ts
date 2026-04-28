import type {
  AiChatResponse,
  AiInsight,
  CalendarMonthResponse,
  CreatePortfolioObjectivePayload,
  CreateProjectPayload,
  CreateProjectChangeProposalPayload,
  CreateWeeklyUpdatePayload,
  DashboardSummary,
  MinistryDistributionItem,
  PerformanceBoardColumn,
  PerformanceScoreItem,
  PortfolioOkrResponse,
  Project,
  ProjectChangeProposal,
  ProjectEvent,
  ResourceCapacitySummary,
  RiskDeviationItem,
  StatusDistributionItem,
  TrendPoint,
  UpcomingEvent,
  User,
  WeeklyUpdate,
} from "@/types";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/$/, "");

type QueryValue = string | number | undefined;

interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, QueryValue>;
  body?: unknown;
}

const buildUrl = (path: string, params?: Record<string, QueryValue>) => {
  const query = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  const suffix = query.toString();
  return `${API_BASE_URL}${path}${suffix ? `?${suffix}` : ""}`;
};

const fixMojibake = (value: string) => {
  const fixed = value
    .replace(/Ã«/g, "ë")
    .replace(/Ã§/g, "ç")
    .replace(/Ã‡/g, "Ç")
    .replace(/Ã–/g, "Ö")
    .replace(/Ã¶/g, "ö")
    .replace(/Ãœ/g, "Ü")
    .replace(/Ã¼/g, "ü");

  return fixed === "in_progress" || fixed === "procurement" ? "active" : fixed;
};

const normalizePayload = <T>(value: T): T => {
  if (typeof value === "string") {
    return fixMojibake(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizePayload(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, normalizePayload(item)]),
    ) as T;
  }

  return value;
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { params, body, headers, ...init } = options;
  const response = await fetch(buildUrl(path, params), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === "object" && payload && "message" in payload
      ? String((payload as { message?: string }).message ?? "Kërkesa dështoi")
      : `Kërkesa dështoi me statusin ${response.status}`;

    throw new Error(message);
  }

  return normalizePayload(payload as T);
};

const authParams = (user: Pick<User, "role" | "ministry">) => ({
  role: user.role,
  ministry: user.ministry,
});

export const api = {
  getMinistries: () => request<string[]>("/reference-data/ministries"),
  getStatuses: () => request<Array<{ value: string; label: string; color: string }>>("/reference-data/statuses"),
  login: (payload: { role: User["role"]; ministry?: string; name?: string }) =>
    request<User>("/auth/login", { method: "POST", body: payload }),
  getDashboardSummary: (user: Pick<User, "role" | "ministry">) =>
    request<DashboardSummary>("/dashboard/summary", { params: authParams(user) }),
  getStatusDistribution: (user: Pick<User, "role" | "ministry">) =>
    request<StatusDistributionItem[]>("/dashboard/status-distribution", { params: authParams(user) }),
  getPerformanceScores: (user: Pick<User, "role" | "ministry">) =>
    request<PerformanceScoreItem[]>("/dashboard/performance", { params: authParams(user) }),
  getTrend: (months = 12) => request<TrendPoint[]>("/dashboard/trend", { params: { months } }),
  getMinistryDistribution: (user: Pick<User, "role" | "ministry">) =>
    request<MinistryDistributionItem[]>("/dashboard/ministry-distribution", { params: authParams(user) }),
  getResourceCapacitySummary: (user: Pick<User, "role" | "ministry">) =>
    request<ResourceCapacitySummary>("/dashboard/resource-capacity", { params: authParams(user) }),
  getProjects: (user: Pick<User, "role" | "ministry">, filters?: { status?: string; query?: string }) =>
    request<Project[]>("/projects", { params: { ...authParams(user), status: filters?.status, query: filters?.query } }),
  createProject: (user: Pick<User, "role" | "ministry">, payload: CreateProjectPayload) =>
    request<Project>("/projects", { method: "POST", params: authParams(user), body: payload }),
  getProject: (user: Pick<User, "role" | "ministry">, id: string) =>
    request<Project>(`/projects/${id}`, { params: authParams(user) }),
  getProjectEvents: (user: Pick<User, "role" | "ministry">, id: string) =>
    request<ProjectEvent[]>(`/projects/${id}/events`, { params: authParams(user) }),
  getProjectAiInsights: (user: Pick<User, "role" | "ministry">, id: string) =>
    request<AiInsight>(`/projects/${id}/ai-insights`, { params: authParams(user) }),
  getPerformanceBoard: (user: Pick<User, "role" | "ministry">) =>
    request<PerformanceBoardColumn[]>("/performance/board", { params: authParams(user) }),
  getPortfolioOkr: (user: Pick<User, "role" | "ministry">) =>
    request<PortfolioOkrResponse>("/portfolio/okr", { params: authParams(user) }),
  createPortfolioObjective: (user: Pick<User, "role" | "ministry">, payload: CreatePortfolioObjectivePayload) =>
    request("/portfolio/okr", { method: "POST", params: authParams(user), body: payload }),
  getRiskDeviations: (user: Pick<User, "role" | "ministry">) =>
    request<RiskDeviationItem[]>("/risk-deviations", { params: authParams(user) }),
  getWeeklyUpdates: (user: Pick<User, "role" | "ministry">, projectId?: string) =>
    request<WeeklyUpdate[]>("/updates", { params: { ...authParams(user), projectId } }),
  createWeeklyUpdate: (user: Pick<User, "role" | "ministry">, payload: CreateWeeklyUpdatePayload) =>
    request<WeeklyUpdate>("/updates", { method: "POST", params: authParams(user), body: payload }),
  getChangeProposals: (user: Pick<User, "role" | "ministry">, projectId?: string) =>
    request<ProjectChangeProposal[]>("/change-proposals", { params: { ...authParams(user), projectId } }),
  createChangeProposal: (user: Pick<User, "role" | "ministry">, payload: CreateProjectChangeProposalPayload) =>
    request<ProjectChangeProposal>("/change-proposals", { method: "POST", params: authParams(user), body: payload }),
  getCalendarMonth: (user: Pick<User, "role" | "ministry">, month: string) =>
    request<CalendarMonthResponse>("/calendar/month", { params: { ...authParams(user), month } }),
  getUpcomingEvents: (user: Pick<User, "role" | "ministry">, limit = 8) =>
    request<UpcomingEvent[]>("/calendar/upcoming", { params: { ...authParams(user), limit } }),
  askAiAssistant: (user: Pick<User, "role" | "ministry">, message: string) =>
    request<AiChatResponse>("/ai/chat", { method: "POST", params: authParams(user), body: { message } }),
};

