import { apiFetch } from '@/services/api.client'
import type { PaginatedResponse, Company } from '@/types/api'

export const companiesService = {
    async getCompanies(params?: Record<string, unknown>): Promise<PaginatedResponse<Company>> {
        const query = new URLSearchParams()
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    query.append(key, String(params[key]))
                }
            })
        }

        return await apiFetch<PaginatedResponse<Company>>(`/companies?${query.toString()}`)
    }
}
