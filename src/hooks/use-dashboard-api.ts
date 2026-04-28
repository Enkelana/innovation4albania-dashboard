import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  CreatePortfolioObjectivePayload,
  CreateProjectPayload,
  CreateProjectChangeProposalPayload,
  CreateWeeklyUpdatePayload,
  User,
} from "@/types";

const authKey = (user: Pick<User, "role" | "ministry"> | null) => [user?.role ?? "guest", user?.ministry ?? "all"];

export function useMinistries() {
  return useQuery({ queryKey: ["ministries"], queryFn: api.getMinistries, staleTime: Infinity });
}

export function useStatuses() {
  return useQuery({ queryKey: ["statuses"], queryFn: api.getStatuses, staleTime: Infinity });
}

export function useDashboardSummary(user: Pick<User, "role" | "ministry"> | null) {
  return useQuery({ queryKey: ["dashboard-summary", ...authKey(user)], queryFn: () => api.getDashboardSummary(user!), enabled: Boolean(user) });
}

export function useStatusDistribution(user: Pick<User, "role" | "ministry"> | null) {
  return useQuery({ queryKey: ["status-distribution", ...authKey(user)], queryFn: () => api.getStatusDistribution(user!), enabled: Boolean(user) });
}

export function useMinistryDistribution(user: Pick<User, "role" | "ministry"> | null) {
  return useQuery({ queryKey: ["ministry-distribution", ...authKey(user)], queryFn: () => api.getMinistryDistribution(user!), enabled: Boolean(user) });
}

export function useDashboardResourceCapacity(user: Pick<User, "role" | "ministry"> | null) {
  return useQuery({ queryKey: ["resource-capacity", ...authKey(user)], queryFn: () => api.getResourceCapacitySummary(user!), enabled: Boolean(user) });
}

export function usePerformanceScores(user: Pick<User, "role" | "ministry"> | null) {
  return useQuery({ queryKey: ["performance-scores", ...authKey(user)], queryFn: () => api.getPerformanceScores(user!), enabled: Boolean(user) });
}

export function useTrend(months = 12) {
  return useQuery({ queryKey: ["trend", months], queryFn: () => api.getTrend(months) });
}

export function useProjects(user: Pick<User, "role" | "ministry"> | null, filters?: { status?: string; query?: string }) {
  return useQuery({
    queryKey: ["projects", ...authKey(user), filters?.status ?? "all", filters?.query ?? ""],
    queryFn: () => api.getProjects(user!, filters),
    enabled: Boolean(user),
  });
}

export function useCreateProject(user: Pick<User, "role" | "ministry"> | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => api.createProject(user!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["status-distribution"] });
      queryClient.invalidateQueries({ queryKey: ["resource-capacity"] });
    },
  });
}

export function useProject(user: Pick<User, "role" | "ministry"> | null, id?: string) {
  return useQuery({ queryKey: ["project", ...authKey(user), id ?? ""], queryFn: () => api.getProject(user!, id!), enabled: Boolean(user && id), retry: false });
}

export function useProjectEvents(user: Pick<User, "role" | "ministry"> | null, id?: string) {
  return useQuery({ queryKey: ["project-events", ...authKey(user), id ?? ""], queryFn: () => api.getProjectEvents(user!, id!), enabled: Boolean(user && id), retry: false });
}

export function useProjectAiInsights(user: Pick<User, "role" | "ministry"> | null, id?: string) {
  return useQuery({
    queryKey: ["project-ai-insights", ...authKey(user), id ?? ""],
    queryFn: () => api.getProjectAiInsights(user!, id!),
    enabled: Boolean(user && id),
    retry: false,
  });
}

export function usePerformanceBoard(user: Pick<User, "role" | "ministry"> | null) {
  return useQuery({ queryKey: ["performance-board", ...authKey(user)], queryFn: () => api.getPerformanceBoard(user!), enabled: Boolean(user) });
}

export function usePortfolioOkr(user: Pick<User, "role" | "ministry"> | null) {
  return useQuery({ queryKey: ["portfolio-okr", ...authKey(user)], queryFn: () => api.getPortfolioOkr(user!), enabled: Boolean(user) });
}

export function useCreatePortfolioObjective(user: Pick<User, "role" | "ministry"> | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePortfolioObjectivePayload) => api.createPortfolioObjective(user!, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["portfolio-okr"] }),
  });
}

export function useRiskDeviations(user: Pick<User, "role" | "ministry"> | null) {
  return useQuery({ queryKey: ["risk-deviations", ...authKey(user)], queryFn: () => api.getRiskDeviations(user!), enabled: Boolean(user) });
}

export function useWeeklyUpdates(user: Pick<User, "role" | "ministry"> | null, projectId?: string) {
  return useQuery({ queryKey: ["weekly-updates", ...authKey(user), projectId ?? "all"], queryFn: () => api.getWeeklyUpdates(user!, projectId), enabled: Boolean(user) });
}

export function useCreateWeeklyUpdate(user: Pick<User, "role" | "ministry"> | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateWeeklyUpdatePayload) => api.createWeeklyUpdate(user!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weekly-updates"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["risk-deviations"] });
      queryClient.invalidateQueries({ queryKey: ["resource-capacity"] });
    },
  });
}

export function useChangeProposals(user: Pick<User, "role" | "ministry"> | null, projectId?: string) {
  return useQuery({ queryKey: ["change-proposals", ...authKey(user), projectId ?? "all"], queryFn: () => api.getChangeProposals(user!, projectId), enabled: Boolean(user) });
}

export function useCreateChangeProposal(user: Pick<User, "role" | "ministry"> | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProjectChangeProposalPayload) => api.createChangeProposal(user!, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["change-proposals"] }),
  });
}

export function useCalendarMonth(user: Pick<User, "role" | "ministry"> | null, cursor: Date) {
  const monthKey = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-01`;
  return useQuery({ queryKey: ["calendar-month", ...authKey(user), monthKey], queryFn: () => api.getCalendarMonth(user!, monthKey), enabled: Boolean(user) });
}

export function useUpcomingEvents(user: Pick<User, "role" | "ministry"> | null, limit = 8) {
  return useQuery({ queryKey: ["upcoming-events", ...authKey(user), limit], queryFn: () => api.getUpcomingEvents(user!, limit), enabled: Boolean(user) });
}

export function useAiAssistant(user: Pick<User, "role" | "ministry"> | null) {
  return useMutation({ mutationFn: (message: string) => api.askAiAssistant(user!, message) });
}

