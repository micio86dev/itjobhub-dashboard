import type { Company, CompaniesFilterParams, PaginatedResponse } from "@/types/api";
import { apiFetch } from "@/services/api.client";

export async function getCompanies(
  params: CompaniesFilterParams = {},
): Promise<PaginatedResponse<Company>["data"]> {
  const response = await apiFetch<PaginatedResponse<Company>>("/companies", {
    query: params,
  });
  return response.data;
}
