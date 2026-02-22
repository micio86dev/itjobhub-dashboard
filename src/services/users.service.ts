import { getUsers as apiGetUsers } from '@/api/users'
import type { UserListItem } from '@/api'

export interface GetUsersParams {
  page?: number
  limit?: number
  search?: string
  role?: string
}

export interface PaginatedUsers {
  items: UserListItem[]
  total: number
  page: number
  pages: number
}

async function getUsers(params: GetUsersParams = {}): Promise<PaginatedUsers> {
  const res = await apiGetUsers({
    page: params.page,
    limit: params.limit,
    role: params.role,
    q: params.search,
  })
  return {
    items: res.data.users,
    total: res.data.pagination.total,
    page: res.data.pagination.page,
    pages: res.data.pagination.pages,
  }
}

export const usersService = { getUsers }
