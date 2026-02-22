import type { News, NewsFilterParams, PaginatedResponse } from "@/types/api";
import { apiFetch } from "@/services/api.client";

export async function getNews(
  params: NewsFilterParams = {},
): Promise<PaginatedResponse<News>["data"]> {
  const response = await apiFetch<PaginatedResponse<News>>("/news", {
    query: params,
  });
  return response.data;
}
