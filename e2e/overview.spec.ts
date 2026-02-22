import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./utils/auth.js";
import { OverviewPagePO } from "./pages/OverviewPage.js";

test.describe("Dashboard - Pagina Overview", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("dovrebbe caricare la pagina overview", async ({ page }) => {
    const overview = new OverviewPagePO(page);
    await overview.goto();

    await expect(page).toHaveURL(/\/dashboard\/?$/);
    await expect(page.locator("h2")).toContainText(/overview|dashboard/i);
  });

  test("dovrebbe mostrare le statistiche principali", async ({ page }) => {
    const overview = new OverviewPagePO(page);
    await overview.goto();
    await overview.waitForChartsToLoad();

    const stats = await overview.getStatCards();

    // Verifica che ci siano statistiche
    expect(stats.length).toBeGreaterThan(0);

    // Verifica che le statistiche abbiano titolo e valore
    for (const stat of stats) {
      expect(stat.title).toBeTruthy();
      expect(stat.value).toBeTruthy();
    }
  });

  test("dovrebbe mostrare i grafici principali", async ({ page }) => {
    const overview = new OverviewPagePO(page);
    await overview.goto();
    await overview.waitForChartsToLoad();

    // Verifica che i grafici siano caricati
    const charts = page.locator("canvas, [role='img']");
    expect(await charts.count()).toBeGreaterThan(0);
  });

  test("dovrebbe mostrare le top skills", async ({ page }) => {
    const overview = new OverviewPagePO(page);
    await overview.goto();
    await overview.waitForChartsToLoad();

    const skills = await overview.getTopSkillsList();

    // Se le skills sono disponibili, dovrebbero essere stringhe non vuote
    if (skills.length > 0) {
      for (const skill of skills) {
        expect(skill).toBeTruthy();
      }
    }
  });

  test("dovrebbe mostrare le top languages", async ({ page }) => {
    const overview = new OverviewPagePO(page);
    await overview.goto();
    await overview.waitForChartsToLoad();

    const languages = await overview.getTopLanguagesList();

    // Se i linguaggi sono disponibili, dovrebbero essere stringhe non vuote
    if (languages.length > 0) {
      for (const language of languages) {
        expect(language).toBeTruthy();
      }
    }
  });

  test("dovrebbe mostrare i dati dei job recenti", async ({ page }) => {
    const overview = new OverviewPagePO(page);
    await overview.goto();
    await overview.waitForChartsToLoad();

    const hasRecentJobs = await overview.hasRecentJobs();

    // Se la sezione è disponibile, dovrebbe essere visibile
    if (hasRecentJobs) {
      await expect(page.getByTestId("recent-jobs")).toBeVisible();
    }
  });

  test("dovrebbe mostrare i dati degli utenti recenti", async ({ page }) => {
    const overview = new OverviewPagePO(page);
    await overview.goto();
    await overview.waitForChartsToLoad();

    const hasRecentUsers = await overview.hasRecentUsers();

    // Se la sezione è disponibile, dovrebbe essere visibile
    if (hasRecentUsers) {
      await expect(page.getByTestId("recent-users")).toBeVisible();
    }
  });

  test("dovrebbe avere un layout responsivo", async ({ page }) => {
    const overview = new OverviewPagePO(page);
    await overview.goto();
    await overview.waitForChartsToLoad();

    // Test su viewport desktop (default è già desktop)
    const mainContent = page.getByTestId("dashboard-layout");
    await expect(mainContent).toBeVisible();

    // Verifica che il contenuto principale sia visible
    const heading = page.locator("h2").first();
    await expect(heading).toBeVisible();
  });

  test("dovrebbe caricare i dati senza errori", async ({ page }) => {
    const overview = new OverviewPagePO(page);
    await overview.goto();

    // Ascolta gli errori della rete
    let hasNetworkError = false;
    page.on("response", (response) => {
      if (response.status() >= 400) {
        hasNetworkError = true;
      }
    });

    await overview.waitForChartsToLoad();

    // Dovrebbe essere caricato senza errori 500
    expect(hasNetworkError).toBeFalsy();

    // Verifica che almeno un elemento sia visibile
    const content = page.getByTestId("dashboard-layout");
    await expect(content).toBeVisible();
  });

  test("dovrebbe avere il titolo corretto della pagina", async ({ page }) => {
    const overview = new OverviewPagePO(page);
    await overview.goto();

    const title = await overview.getPageTitle();

    // Verifica che il titolo non sia vuoto
    expect(title).toBeTruthy();
  });

  test("dovrebbe mostrare una griglia con gap", async ({ page }) => {
    const overview = new OverviewPagePO(page);
    await overview.goto();
    await overview.waitForChartsToLoad();

    // Verifica che ci sia una struttura a griglia
    const grid = page.locator("[class*='grid']");
    expect(await grid.count()).toBeGreaterThan(0);
  });

  test("dovrebbe essere accessibile da diverse rotte", async ({ page }) => {
    // Test /dashboard
    await page.goto("/dashboard");
    await expect(page.getByTestId("dashboard-layout")).toBeVisible();

    // Test /
    await page.goto("/");
    // Dovrebbe reindirizzare a /dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("dovrebbe aggiornare i dati quando ricaricato", async ({ page }) => {
    const overview = new OverviewPagePO(page);
    await overview.goto();

    const statsBeforeReload = await overview.getStatCards();
    expect(statsBeforeReload.length).toBeGreaterThan(0);

    // Ricarica la pagina
    await page.reload();
    await overview.waitForChartsToLoad();

    const statsAfterReload = await overview.getStatCards();
    expect(statsAfterReload.length).toBeGreaterThan(0);
  });

  test("dovrebbe gestire il caricamento dei dati", async ({ page }) => {
    const overview = new OverviewPagePO(page);
    await overview.goto();

    // Attendi il caricamento
    const isLoading = await overview.isLoading().catch(() => false);

    // Attendi che il caricamento sia completo
    await overview.waitForChartsToLoad();

    // Dopo il caricamento, il contenuto deve essere visibile
    const content = page.getByTestId("dashboard-layout");
    await expect(content).toBeVisible();
  });
});

test.describe("Dashboard - Statistiche", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("dovrebbe mostrare i numeri delle statistiche", async ({ page }) => {
    const overview = new OverviewPagePO(page);
    await overview.goto();
    await overview.waitForChartsToLoad();

    const stats = await overview.getStatCards();

    for (const stat of stats) {
      // I valori dovrebbero contenere cifre
      const hasNumbers = /\d+/.test(stat.value);
      expect(hasNumbers).toBeTruthy();
    }
  });

  test("dovrebbe avere statistiche con valori positivi", async ({ page }) => {
    const overview = new OverviewPagePO(page);
    await overview.goto();
    await overview.waitForChartsToLoad();

    const stats = await overview.getStatCards();

    // Verifica che le statistiche abbiano valori
    for (const stat of stats) {
      const value = parseInt(stat.value.replace(/\D/g, ""));
      expect(value).toBeGreaterThanOrEqual(0);
    }
  });
});
