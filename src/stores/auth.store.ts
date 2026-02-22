import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import { apiFetch } from '@/services/api.client';
import type { User } from '@/types/api';

interface AuthState {
    token: string | null;
    user: User | null;
    loading: boolean;
    error: string | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        token: Cookies.get('admin-token') || null,
        user: null,
        loading: false,
        error: null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token && !!state.user,
        userName: (state) => (state.user ? `${state.user.firstName} ${state.user.lastName}` : ''),
    },
    actions: {
        async login(email: string, password: string): Promise<void> {
            this.loading = true;
            this.error = null;
            try {
                const { data: responseData } = await apiFetch<{ data: { accessToken?: string, token?: string, user: User } }>('/auth/login', {
                    method: 'POST',
                    body: { email, password },
                });

                this.token = responseData.token || null;
                this.user = responseData.user;
                Cookies.set('admin-token', this.token as string, { expires: 7 });
            } catch (err: unknown) {
                const fetchErr = err as { data?: { message?: string }, message?: string };
                this.error = fetchErr.data?.message || fetchErr.message || 'Errore durante il login';
                throw err;
            } finally {
                this.loading = false;
            }
        },
        async logout(): Promise<void> {
            try {
                if (this.token) {
                    await apiFetch('/auth/logout', { method: 'POST' });
                }
            } catch {
                // Silently fail logout if network error
            } finally {
                this.token = null;
                this.user = null;
                Cookies.remove('admin-token');
            }
        },
        async fetchMe(): Promise<void> {
            if (!this.token) return;
            this.loading = true;
            try {
                const response = await apiFetch<{ data: User }>('/users/me');
                this.user = response?.data || null;
            } catch {
                this.token = null;
                this.user = null;
                Cookies.remove('admin-token');
            } finally {
                this.loading = false;
            }
        },
    },
});
