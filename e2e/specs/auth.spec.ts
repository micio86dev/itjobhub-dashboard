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

    test('mostra alert di errore se login fallisce (mock)', async ({ page }) => {
        // Intercept and mock API failure
        await page.route('**/auth/login', route => {
            route.fulfill({
                status: 401,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'Credenziali errate' })
            });
        });

        await page.goto('/login');
        await page.getByTestId('email').fill('user@example.com');
        await page.getByTestId('password').fill('wrongpass');
        await page.getByTestId('login-btn').click();

        // Verifica alert errore
        await expect(page.getByTestId('login-error')).toBeVisible();
        await expect(page.getByTestId('login-error')).toContainText('Credenziali errate');
    });

    test('login valido fa redirect alla dashboard (mock)', async ({ page }) => {
        // Intercept and mock API success
        await page.route('**/auth/login', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    accessToken: 'fake-token',
                    user: {
                        id: '1',
                        email: 'admin@example.com',
                        first_name: 'Admin',
                        last_name: 'User',
                        role: 'admin'
                    }
                })
            });
        });

        await page.goto('/login');
        await page.getByTestId('email').fill('admin@example.com');
        await page.getByTestId('password').fill('password123');
        await page.getByTestId('login-btn').click();

        // Controlla che il routing avvenga
        await expect(page).toHaveURL(/.*\/dashboard/);
    });
});
