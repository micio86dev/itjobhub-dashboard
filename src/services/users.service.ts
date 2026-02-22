import { apiFetch } from '@/services/api.client'
import type { PaginatedResponse, User } from '@/types/api'

export const usersService = {
    async getUsers(params?: Record<string, unknown>): Promise<PaginatedResponse<User>> {
        const query = new URLSearchParams()
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    query.append(key, String(params[key]))
                }
            })
        }

        return await apiFetch<PaginatedResponse<User>>(`/users?${query.toString()}`)
    }
}
