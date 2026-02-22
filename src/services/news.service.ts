import { apiFetch } from '@/services/api.client'
import type { PaginatedResponse, News } from '@/types/api'

export const newsService = {
    async getNews(params?: Record<string, unknown>): Promise<PaginatedResponse<News>> {
        const query = new URLSearchParams()
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    query.append(key, String(params[key]))
                }
            })
        }

        return await apiFetch<PaginatedResponse<News>>(`/news?${query.toString()}`)
    }
}
