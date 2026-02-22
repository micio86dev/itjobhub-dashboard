import type { Job, JobsFilterParams, PaginatedResponse, TopSkill } from "@/types/api";
import { apiFetch } from "@/services/api.client";

function toQuery(params?: JobsFilterParams) {
  if (!params) return {};
  return {
    ...params,
    skills: params.skills?.join(","),
  };
}

export async function getJobs(
  params: JobsFilterParams = {},
): Promise<PaginatedResponse<Job>["data"]> {
  const response = await apiFetch<PaginatedResponse<Job>>("/jobs", {
    query: toQuery(params),
  });
  return response.data;
}

export async function getJobsWithLocation(
  params: JobsFilterParams = {},
): Promise<PaginatedResponse<Job>["data"]> {
  const data = await getJobs(params);
  const filtered = data.data.filter((job) => job.location_geo?.coordinates?.length);
  return { ...data, data: filtered };
}

export async function getTopSkills(limit = 30): Promise<TopSkill[]> {
  const response = await apiFetch<{ data: TopSkill[] }>("/jobs/stats/skills", {
    query: { limit },
  });
  const data = "data" in response ? response.data : (response as TopSkill[]);
  return [...data].sort((a, b) => b.count - a.count);
}
