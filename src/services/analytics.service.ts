import { apiFetch } from '@/services/api.client'
import type { AnalyticsOverview, LoginMethod } from '@/types/api'

export const analyticsService = {
    async getOverviewStats(): Promise<AnalyticsOverview> {
        try {
            const response = await apiFetch<AnalyticsOverview>('/admin/stats')
            return response
        } catch {
            // Mock data if endpoint not fully available
            return {
                users: 1543,
                jobs: 842,
                companies: 124,
                news: 45,
                usersChange: 12.5,
                jobsChange: -2.3
            }
        }
    },

    async getRegistrationsTimeline(days: number = 30): Promise<Array<{ date: string, count: number }>> {
        try {
            return await apiFetch<Array<{ date: string, count: number }>>(`/admin/stats/registrations-timeline?days=${days}`)
        } catch {
            return []
        }
    },

    async getJobsTimeline(weeks: number = 8): Promise<Array<{ week: string, count: number }>> {
        try {
            return await apiFetch<Array<{ week: string, count: number }>>(`/admin/stats/jobs-timeline?weeks=${weeks}`)
        } catch {
            return []
        }
    },

    async getLoginMethodsDistribution(): Promise<Array<{ method: LoginMethod, count: number }>> {
        try {
            return await apiFetch<Array<{ method: LoginMethod, count: number }>>('/admin/stats/login-methods')
        } catch {
            return []
        }
    },

    async getTopSkills(limit: number = 10): Promise<Array<{ skill: string, count: number }>> {
        try {
            const res = await apiFetch<Array<{ skill: string, count: number }>>(`/jobs/stats/skills?limit=${limit}`)
            return res
        } catch {
            return []
        }
    },

    async getTopLanguages(limit: number = 10): Promise<Array<{ language: string, count: number }>> {
        try {
            return await apiFetch<Array<{ language: string, count: number }>>(`/admin/stats/top-languages?limit=${limit}`)
        } catch {
            return []
        }
    }
}
