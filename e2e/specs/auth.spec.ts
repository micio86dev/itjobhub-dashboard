import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
    test('login valido -> URL /dashboard', async ({ page }) => {
        // TODO
    });

    test('login invalido -> errore visibile', async ({ page }) => {
        // TODO
    });

    test('accesso senza token -> redirect /login', async ({ page }) => {
        // TODO
    });

    test('logout -> URL /login, cookie rimosso', async ({ page }) => {
        // TODO
    });
});
