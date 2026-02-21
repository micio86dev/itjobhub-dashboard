import { ofetch } from 'ofetch';
import { useAuthStore } from '@/stores/auth.store';
import router from '@/router';

export const apiFetch = ofetch.create({
    baseURL: import.meta.env.PUBLIC_API_URL || 'http://localhost:3001',
    onRequest({ options }) {
        const authStore = useAuthStore();
        if (authStore.token) {
            options.headers = new Headers(options.headers);
            options.headers.set('Authorization', `Bearer ${authStore.token}`);
        }
    },
    async onResponseError({ response }) {
        if (response.status === 401) {
            const authStore = useAuthStore();
            await authStore.logout();
            await router.push('/login');
        }
    }
});
