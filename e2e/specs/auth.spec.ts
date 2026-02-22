import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
    test('trova gli elementi del form di login by data-testid', async ({ page }) => {
        await page.goto('/login');

        // Verifica campi input
        await expect(page.getByTestId('email')).toBeVisible();
        await expect(page.getByTestId('password')).toBeVisible();

        // Verifica bottone submit
        await expect(page.getByTestId('login-btn')).toBeVisible();
    });

    test('mostra alert di errore con credenziali sbagliate (backend reale)', async ({ page }) => {
        await page.goto('/login');
        await page.getByTestId('email').fill('utente-inesistente@fake-domain.test');
        await page.getByTestId('password').fill('password-sbagliata-12345');
        await page.getByTestId('login-btn').click();

        // Il backend reale risponde con errore autentico
        await expect(page.getByTestId('login-error')).toBeVisible({ timeout: 10000 });
    });

    test('login valido fa redirect alla dashboard (credenziali reali da ENV)', async ({ page }) => {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        test.skip(!adminEmail || !adminPassword, 'ADMIN_EMAIL/ADMIN_PASSWORD not configured in .env');

        await page.goto('/login');
        await page.getByTestId('email').fill(adminEmail!);
        await page.getByTestId('password').fill(adminPassword!);
        await page.getByTestId('login-btn').click();

        // Verifica redirect alla dashboard con il backend reale
        await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });
    });
});
