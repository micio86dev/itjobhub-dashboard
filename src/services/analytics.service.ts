import type { AdminStats, Language, LoginMethodDist, TimelinePoint, TopSkill } from "@/types/api";
import { apiFetch } from "@/services/api.client";

function unwrapData<T>(response: { data: T } | T): T {
  if (typeof response === "object" && response !== null && "data" in response) {
    return (response as { data: T }).data;
  }
  return response as T;
}

export async function getOverviewStats(): Promise<AdminStats["data"]> {
  const response = await apiFetch<AdminStats>("/admin/stats");
  return response.data;
}

export async function getRegistrationsTimeline(days = 30): Promise<TimelinePoint[]> {
  const response = await apiFetch<{ data: TimelinePoint[] }>(
    "/admin/stats/registrations-timeline",
    { query: { days } },
  );
  return unwrapData(response);
}

export async function getJobsTimeline(weeks = 8): Promise<TimelinePoint[]> {
  const response = await apiFetch<{ data: TimelinePoint[] }>("/admin/stats/jobs-timeline", {
    query: { weeks },
  });
  return unwrapData(response);
}

export async function getLoginMethodsDistribution(): Promise<LoginMethodDist[]> {
  const response = await apiFetch<{ data: LoginMethodDist[] }>("/admin/stats/login-methods");
  return unwrapData(response);
}

export async function getTopSkills(limit = 10): Promise<TopSkill[]> {
  const response = await apiFetch<{ data: TopSkill[] }>("/jobs/stats/skills", {
    query: { limit },
  });
  return unwrapData(response);
}

export async function getTopLanguages(limit = 10): Promise<Language[]> {
  const response = await apiFetch<{ data: Language[] }>("/admin/stats/top-languages", {
    query: { limit },
  });
  return unwrapData(response);
}
