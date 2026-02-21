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
        // TODO: Endpoint GET /admin/stats/registrations-timeline missing, mocking data
        const data = []
        const now = new Date()
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(now)
            d.setDate(d.getDate() - i)
            data.push({
                date: d.toISOString().split('T')[0] || '',
                count: Math.floor(Math.random() * 50) + 10
            })
        }
        return data
    },

    async getJobsTimeline(weeks: number = 8): Promise<Array<{ week: string, count: number }>> {
        // TODO: Endpoint GET /admin/stats/jobs-timeline missing, mocking data
        const data = []
        const now = new Date()
        for (let i = weeks - 1; i >= 0; i--) {
            const d = new Date(now)
            d.setDate(d.getDate() - i * 7)
            data.push({
                week: `W${i + 1}`,
                count: Math.floor(Math.random() * 100) + 20
            })
        }
        return data
    },

    async getLoginMethodsDistribution(): Promise<Array<{ method: LoginMethod, count: number }>> {
        // TODO: Endpoint GET /admin/stats/login-methods missing, mocking data
        return [
            { method: 'email', count: 854 },
            { method: 'google', count: 421 },
            { method: 'linkedin', count: 215 },
            { method: 'github', count: 53 }
        ]
    },

    async getTopSkills(limit: number = 10): Promise<Array<{ skill: string, count: number }>> {
        try {
            const res = await apiFetch<Array<{ skill: string, count: number }>>('/jobs/stats/skills')
            return res.slice(0, limit)
        } catch {
            return [
                { skill: 'Vue.js', count: 320 },
                { skill: 'TypeScript', count: 280 },
                { skill: 'Node.js', count: 250 },
                { skill: 'React', count: 210 },
                { skill: 'Python', count: 190 },
                { skill: 'Docker', count: 150 },
                { skill: 'AWS', count: 120 },
                { skill: 'MongoDB', count: 95 },
                { skill: 'PostgreSQL', count: 80 },
                { skill: 'Tailwind CSS', count: 75 }
            ].slice(0, limit)
        }
    },

    async getTopLanguages(limit: number = 10): Promise<Array<{ language: string, count: number }>> {
        // TODO: Endpoint GET /admin/stats/top-languages missing, mocking data
        return [
            { language: 'Italian', count: 680 },
            { language: 'English', count: 420 },
            { language: 'Spanish', count: 85 },
            { language: 'French', count: 45 },
            { language: 'German', count: 20 }
        ].slice(0, limit)
    }
}
