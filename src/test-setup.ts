import { afterEach, vi } from 'vitest';

// Polyfill matchMedia for jsdom (not available natively)
// This is an environment polyfill, NOT a business logic mock
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Clean up between tests
afterEach(() => {
    // Reset document.cookie
    document.cookie.split(';').forEach((c) => {
        document.cookie = c
            .replace(/^ +/, '')
            .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
    // Reset document classes
    document.documentElement.classList.remove('dark');
});
