import type { PaginatedResponse, News } from '@/types/api'

export const newsService = {
    async getNews(_params?: Record<string, unknown>): Promise<PaginatedResponse<News>> {
        // TODO: Endpoint GET /news/ mockato.
        return {
            data: [
                { id: '1', title: 'Nuovo aggiornamento piattaforma ITJobHub', content: 'Abbiamo rilasciato la versione 2.0 con nuove feature per le aziende.', category: 'Product', created_at: new Date(Date.now() - 86400000).toISOString() },
                { id: '2', title: 'Manutenzione programmata', content: 'I server saranno offline sabato notte per 2 ore.', category: 'System', created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
                { id: '3', title: 'Aumentano le offerte per React', content: 'Il report mensile mostra un +15% per le posizioni frontend con React.', category: 'Market', created_at: new Date(Date.now() - 86400000 * 7).toISOString() },
                { id: '4', title: 'Benvenuti su ITJobHub', content: 'Guida introduttiva su come utilizzare il nuovo portale.', category: 'Guide', created_at: new Date(Date.now() - 86400000 * 15).toISOString() },
            ],
            total: 4,
            page: 1,
            limit: 10,
            totalPages: 1
        } as PaginatedResponse<News>
    }
}
