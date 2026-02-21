import { apiFetch } from '@/services/api.client'
import type { PaginatedResponse, Job } from '@/types/api'

export const jobsService = {
    async getJobs(params?: Record<string, unknown>): Promise<PaginatedResponse<Job>> {
        try {
            const sp = new URLSearchParams()
            if (params) {
                Object.entries(params).forEach(([k, v]) => {
                    if (v !== undefined && v !== null && v !== '') {
                        sp.append(k, String(v))
                    }
                })
            }
            const res = await apiFetch<PaginatedResponse<Job>>(`/jobs?${sp.toString()}`)
            return res
        } catch {
            // Return empty if API fails
            return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 }
        }
    }
}
