import { ref, readonly, watch } from 'vue';
import Cookies from 'js-cookie';

const mode = ref<'light' | 'dark' | 'system'>('system');

function initTheme() {
    const saved = Cookies.get('admin-theme') as 'light' | 'dark' | 'system' | undefined;
    if (saved) {
        mode.value = saved;
    } else {
        // defaults to system, maybe read media query
        const prefersDark = typeof window !== 'undefined' && window.matchMedia
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
            : false;
        mode.value = prefersDark ? 'dark' : 'light';
    }
}

if (typeof window !== 'undefined') {
    initTheme();
}

watch(mode, (newMode) => {
    if (typeof document !== 'undefined') {
        if (newMode === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
    Cookies.set('admin-theme', newMode, { expires: 365 });
}, { immediate: true });

export function useTheme() {
    const toggleTheme = () => {
        mode.value = mode.value === 'dark' ? 'light' : 'dark';
    };

    return {
        theme: readonly(mode),
        toggleTheme,
        setMode: (m: 'light' | 'dark' | 'system') => { mode.value = m; }
    };
}
