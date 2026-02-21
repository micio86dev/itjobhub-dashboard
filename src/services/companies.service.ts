import type { PaginatedResponse, Company } from '@/types/api'

export const companiesService = {
    async getCompanies(_params?: Record<string, unknown>): Promise<PaginatedResponse<Company>> {
        // TODO: L'endpoint GET /companies/ non esiste o non è finalizzato nel backend.
        // Ritorniamo un array mock per visualizzare subito il layout.
        return {
            data: [
                { id: '1', name: 'Tech Solutions Inc.', industry: 'IT Services', website: 'https://example.com/tech', logo_url: '', trustScore: 4.5, totalRatings: 120, totalLikes: 100, totalDislikes: 20 },
                { id: '2', name: 'DataCorp', industry: 'Data Science', website: 'https://example.com/data', logo_url: '', trustScore: 4.2, totalRatings: 85, totalLikes: 70, totalDislikes: 15 },
                { id: '3', name: 'FinTech Group', industry: 'Finance', website: 'https://example.com/fin', logo_url: '', trustScore: 4.8, totalRatings: 210, totalLikes: 195, totalDislikes: 15 },
                { id: '4', name: 'Creative Agency Ltd.', industry: 'Marketing', website: 'https://example.com/creative', logo_url: '', trustScore: 3.9, totalRatings: 45, totalLikes: 35, totalDislikes: 10 },
                { id: '5', name: 'Global Logistics', industry: 'Logistics', website: 'https://example.com/logistics', logo_url: '', trustScore: 4.1, totalRatings: 60, totalLikes: 50, totalDislikes: 10 },
                { id: '6', name: 'MedHealth', industry: 'Healthcare', website: '', logo_url: '', trustScore: 4.6, totalRatings: 150, totalLikes: 140, totalDislikes: 10 },
                { id: '7', name: 'EduSmart', industry: 'Education', website: 'https://example.com/edu', logo_url: '', trustScore: 4.3, totalRatings: 90, totalLikes: 80, totalDislikes: 10 },
                { id: '8', name: 'SecureNet', industry: 'Cybersecurity', website: 'https://example.com/secure', logo_url: '', trustScore: 4.7, totalRatings: 180, totalLikes: 165, totalDislikes: 15 },
            ],
            total: 8,
            page: 1,
            limit: 10,
            totalPages: 1
        }
    }
}
