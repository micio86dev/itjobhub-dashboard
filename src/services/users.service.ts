import type { PaginatedResponse, User } from '@/types/api'

export const usersService = {
    async getUsers(_params?: Record<string, unknown>): Promise<PaginatedResponse<User>> {
        // TODO: L'endpoint GET /users/ non esiste nel backend attuale.
        // Ritorniamo un array mock vuoto per soddisfare l'interfaccia.
        return {
            data: [
                { id: '1', email: 'admin@example.com', first_name: 'Admin', last_name: 'User', role: 'admin', created_at: new Date().toISOString() },
                { id: '2', email: 'test@example.com', first_name: 'Test', last_name: 'User', role: 'user', created_at: new Date().toISOString() },
            ],
            total: 2,
            page: 1,
            limit: 10,
            totalPages: 1
        }
    }
}
