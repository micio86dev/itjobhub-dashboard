import type { PaginatedResponse, User } from "@/types/api";

export async function getUsers(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    loginMethod?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {},
): Promise<PaginatedResponse<User>["data"]> {
  void params;
  // TODO: endpoint GET /users is missing in backend.
  return {
    data: [],
    total: 0,
    page: params.page ?? 1,
    limit: params.limit ?? 25,
    totalPages: 0,
  };
}
