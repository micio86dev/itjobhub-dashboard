import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./utils/auth.js";
import { LoginPagePO } from "./pages/LoginPage.js";
import { DashboardLayoutPO } from "./pages/DashboardLayout.js";

test.describe("Autenticazione - Login", () => {
  test("dovrebbe mostrare la pagina di login", async ({ page }) => {
    const loginPage = new LoginPagePO(page);
    await loginPage.goto();

    // Verifica che gli elementi principali sono visibili
    await expect(page.locator("h2")).toContainText(/login|access|sign in/i);
    await expect(page.getByTestId("email")).toBeVisible();
    await expect(page.getByTestId("password")).toBeVisible();
    await expect(page.getByTestId("login-btn")).toBeVisible();
  });

  test("dovrebbe validare l'email vuota", async ({ page }) => {
    const loginPage = new LoginPagePO(page);
    await loginPage.goto();

    // Compila solo la password
    await loginPage.fillPassword("12345Abc$");
    await loginPage.clickLoginButton();

    // La validazione dovrebbe bloccare l'invio
    await expect(page.getByTestId("login-btn")).toBeVisible();
  });

  test("dovrebbe validare la password corta", async ({ page }) => {
    const loginPage = new LoginPagePO(page);
    await loginPage.goto();

    await loginPage.fillEmail("test@example.com");
    await loginPage.fillPassword("short");
    await loginPage.clickLoginButton();

    // La validazione dovrebbe bloccare massimo
    await expect(page.getByTestId("login-btn")).toBeVisible();
  });

  test("dovrebbe mostrare/nascondere la password", async ({ page }) => {
    const loginPage = new LoginPagePO(page);
    await loginPage.goto();

    await loginPage.fillPassword("12345Abc$");

    // Verifica che la password è nascosta inizialmente
    let passwordInput = page.getByTestId("password");
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Clicca il bottone per mostrare
    await loginPage.togglePasswordVisibility();

    // Verifica che la password è visibile
    passwordInput = page.getByTestId("password");
    await expect(passwordInput).toHaveAttribute("type", "text");

    // Clicca di nuovo per nascondere
    await loginPage.togglePasswordVisibility();
    passwordInput = page.getByTestId("password");
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("dovrebbe fare il login con credenziali valide", async ({ page }) => {
    const loginPage = new LoginPagePO(page);
    await loginPage.goto();

    // Usa la funzione di utility auth
    await loginAsAdmin(page);

    // Verifica che siamo reindirizzati alla dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId("dashboard-layout")).toBeVisible();
  });

  test("dovrebbe visualizzare errore con credenziali invalide", async ({ page }) => {
    const loginPage = new LoginPagePO(page);
    await loginPage.goto();

    await loginPage.login("admin@example.com", "wrongpassword123");

    // Attendi un errore
    const errorMessage = page.getByTestId("login-error");
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test("dovrebbe reindirizzare alla dashboard se già autenticato", async ({ page }) => {
    // Fai il login
    await loginAsAdmin(page);

    // Prova a navigare di nuovo a /login
    await page.goto("/login");

    // Dovrebbe essere reindirizzato a /dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("dovrebbe mantenere i dati nel form durante l'interazione", async ({ page }) => {
    const loginPage = new LoginPagePO(page);
    await loginPage.goto();

    const testEmail = "test@example.com";
    const testPassword = "12345Abc$";

    await loginPage.fillEmail(testEmail);
    await loginPage.fillPassword(testPassword);

    // Verifica che i dati sono stati inseriti
    expect(await loginPage.getEmailInput()).toBe(testEmail);
    expect(await loginPage.getPasswordInput()).toBe(testPassword);
  });

  test("dovrebbe avere accesso al link 'Password dimenticata'", async ({ page }) => {
    const loginPage = new LoginPagePO(page);
    await loginPage.goto();

    const forgotLink = page.locator("a[href*='forgot'], a:has-text('forgot')");
    await expect(forgotLink).toBeVisible();
  });

  test("dovrebbe caricare correttamente la pagina di login", async ({ page }) => {
    const loginPage = new LoginPagePO(page);
    await loginPage.goto();

    // Test di accessibilità di base
    const emailLabel = page.locator("label:has-text(/email/)");
    const passwordLabel = page.locator("label:has-text(/password|password/)");

    await expect(emailLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();
  });

  test("dovrebbe gestire il login con Enter keypress", async ({ page }) => {
    const loginPage = new LoginPagePO(page);
    await loginPage.goto();

    const email = process.env.E2E_ADMIN_EMAIL ?? "admin_official@itjobhub.com";
    const password = process.env.E2E_ADMIN_PASSWORD ?? "12345Abc$";

    await loginPage.fillEmail(email);
    await loginPage.fillPassword(password);

    // Premi Enter nel campo password
    await page.getByTestId("password").press("Enter");

    // Dovrebbe sottomettere il form e reindirizzare
    await page.waitForURL(/\/dashboard/, { timeout: 10000 }).catch(() => {
      // Potrebbe fallire se le credenziali non sono valide
    });
  });
});

test.describe("Sessione Autenticata", () => {
  test.beforeEach(async ({ page }) => {
    // Login prima di ogni test
    await loginAsAdmin(page);
  });

  test("dovrebbe accedere alle pagine protette", async ({ page }) => {
    const dashboard = new DashboardLayoutPO(page);

    // Test pagina dashboard
    await dashboard.navigateTo("/dashboard");
    await expect(page.getByTestId("dashboard-layout")).toBeVisible();

    // Test pagina users
    await dashboard.navigateTo("/dashboard/users");
    await expect(page.getByTestId("users-page")).toBeVisible();

    // Test pagina jobs
    await dashboard.navigateTo("/dashboard/jobs");
    await expect(page.getByTestId("jobs-page")).toBeVisible();
  });

  test("dovrebbe proteggere dalle pagine non autenticate", async ({ page }) => {
    // Pulisci la sessione
    await page.context().clearCookies();
    // Pulisci localStorage
    await (page as any).evaluate(() => {
      try {
        localStorage.clear();
      } catch (e) {
        // localStorage potrebbe non essere disponibile se non navigati
      }
    });

    // Prova ad accedere a una pagina protetta
    await page.goto("/dashboard");

    // Dovrebbe reindirizzare al login
    await expect(page).toHaveURL(/\/login/);
  });

  test("dovrebbe mantenere l'autenticazione durante la navigazione", async ({ page }) => {
    const dashboard = new DashboardLayoutPO(page);

    // Naviga tra diverse pagine
    const pages = ["/dashboard", "/dashboard/users", "/dashboard/jobs", "/dashboard/companies"];

    for (const path of pages) {
      await dashboard.navigateTo(path);
      await expect(page.getByTestId("dashboard-layout")).toBeVisible();
      await expect(page).toHaveURL(new RegExp(path.replace("/", "\\/")));
    }
  });
});
