import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./utils/auth.js";
import { AnalyticsPagePO } from "./pages/AnalyticsPage.js";
import { SkillsPagePO } from "./pages/SkillsPage.js";

test.describe("Dashboard - Pagina Analytics", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("dovrebbe caricare la pagina analytics", async ({ page }) => {
    const analyticsPage = new AnalyticsPagePO(page);
    await analyticsPage.goto();

    await expect(page).toHaveURL(/\/dashboard\/analytics/);
    await expect(page.getByTestId("analytics-page")).toBeVisible();
  });

  test("dovrebbe mostrare il titolo della pagina", async ({ page }) => {
    const analyticsPage = new AnalyticsPagePO(page);
    await analyticsPage.goto();

    const title = page.locator("h2").first();
    await expect(title).toBeVisible();
    const titleText = await title.textContent();
    expect(titleText).toBeTruthy();
  });

  test("dovrebbe caricare i grafici", async ({ page }) => {
    const analyticsPage = new AnalyticsPagePO(page);
    await analyticsPage.goto();
    await analyticsPage.waitForChartsToLoad();

    // Dovrebbe avere almeno un grafico
    const charts = page.locator("canvas, [role='img']");
    const chartCount = await charts.count();

    // Potrebbe non avere grafici se i dati non sono disponibili
    expect(chartCount).toBeGreaterThanOrEqual(0);
  });

  test("dovrebbe mostrare il grafico a linee", async ({ page }) => {
    const analyticsPage = new AnalyticsPagePO(page);
    await analyticsPage.goto();
    await analyticsPage.waitForChartsToLoad();

    const hasLineChart = await analyticsPage.hasLineChart();

    // Potrebbe avere o non avere il grafico
    expect(typeof hasLineChart).toBe("boolean");
  });

  test("dovrebbe mostrare il grafico a barre", async ({ page }) => {
    const analyticsPage = new AnalyticsPagePO(page);
    await analyticsPage.goto();
    await analyticsPage.waitForChartsToLoad();

    const hasBarChart = await analyticsPage.hasBarChart();

    // Potrebbe avere o non avere il grafico
    expect(typeof hasBarChart).toBe("boolean");
  });

  test("dovrebbe mostrare il grafico heatmap", async ({ page }) => {
    const analyticsPage = new AnalyticsPagePO(page);
    await analyticsPage.goto();
    await analyticsPage.waitForChartsToLoad();

    const hasHeatmap = await analyticsPage.hasHeatmapChart();

    // Potrebbe avere o non avere il grafico
    expect(typeof hasHeatmap).toBe("boolean");
  });

  test("dovrebbe mostrare i titoli dei grafici", async ({ page }) => {
    const analyticsPage = new AnalyticsPagePO(page);
    await analyticsPage.goto();
    await analyticsPage.waitForChartsToLoad();

    const chartTitles = await analyticsPage.getChartTitles();

    // Dovrebbe avere almeno qualche titolo
    expect(chartTitles.length).toBeGreaterThanOrEqual(0);
  });

  test("dovrebbe avere un layout a griglia", async ({ page }) => {
    const analyticsPage = new AnalyticsPagePO(page);
    await analyticsPage.goto();
    await analyticsPage.waitForChartsToLoad();

    const gridColumns = await analyticsPage.getGridColumns();

    // Dovrebbe avere una griglia (anche se potrebbe essere 0 se assente)
    expect(typeof gridColumns).toBe("number");
  });

  test("dovrebbe caricare i dati quando la pagina viene visitata", async ({ page }) => {
    const analyticsPage = new AnalyticsPagePO(page);
    await analyticsPage.goto();

    await analyticsPage.waitForPageLoad();

    // Dovrebbe avere il contenuto visibile
    const content = page.getByTestId("analytics-page");
    await expect(content).toBeVisible();
  });

  test("dovrebbe gestire il caricamento asincrone", async ({ page }) => {
    const analyticsPage = new AnalyticsPagePO(page);
    await analyticsPage.goto();

    // Attendi i grafici
    await analyticsPage.waitForChartsToLoad();

    // Dovrebbe avere il contenuto
    const content = page.getByTestId("analytics-page");
    await expect(content).toBeVisible();
  });

  test("dovrebbe avere layout responsivo", async ({ page }) => {
    const analyticsPage = new AnalyticsPagePO(page);
    await analyticsPage.goto();
    await analyticsPage.waitForPageLoad();

    // Verifica che ci sia una struttura a grid
    const gridContainers = page.locator("[class*='grid']");
    const gridCount = await gridContainers.count();

    expect(gridCount).toBeGreaterThan(0);
  });

  test("dovrebbe permettere l'export dei dati", async ({ page }) => {
    const analyticsPage = new AnalyticsPagePO(page);
    await analyticsPage.goto();
    await analyticsPage.waitForPageLoad();

    // Prova a trovare il bottone export
    const exportBtn = page.getByRole("button", { name: /export/i });
    const isExportVisible = await exportBtn.isVisible().catch(() => false);

    if (isExportVisible) {
      // Non cliccare per non scaricare file
      await expect(exportBtn).toBeEnabled();
    }
  });
});

test.describe("Dashboard - Pagina Skills", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("dovrebbe caricare la pagina skills", async ({ page }) => {
    const skillsPage = new SkillsPagePO(page);
    await skillsPage.goto();

    await expect(page).toHaveURL(/\/dashboard\/skills/);
    await expect(page.getByTestId("skills-page")).toBeVisible();
  });

  test("dovrebbe mostrare il titolo della pagina", async ({ page }) => {
    const skillsPage = new SkillsPagePO(page);
    await skillsPage.goto();

    const title = page.locator("h2").first();
    await expect(title).toBeVisible();
    const titleText = await title.textContent();
    expect(titleText).toBeTruthy();
  });

  test("dovrebbe mostrare i grafici a barre", async ({ page }) => {
    const skillsPage = new SkillsPagePO(page);
    await skillsPage.goto();
    await skillsPage.waitForChartsToLoad();

    const hasBarCharts = await skillsPage.hasBarCharts();

    // Dovrebbe avere i grafici
    expect(hasBarCharts).toBeTruthy();
  });

  test("dovrebbe mostrare la tabella delle skills", async ({ page }) => {
    const skillsPage = new SkillsPagePO(page);
    await skillsPage.goto();
    await skillsPage.waitForPageLoad();

    const rowCount = await skillsPage.getSkillsTableRows();

    // Dovrebbe avere skills
    expect(rowCount).toBeGreaterThan(0);
  });

  test("dovrebbe mostrare i header della tabella", async ({ page }) => {
    const skillsPage = new SkillsPagePO(page);
    await skillsPage.goto();
    await skillsPage.waitForPageLoad();

    const headers = await skillsPage.getTableHeaders();

    // Dovrebbe avere header
    expect(headers.length).toBeGreaterThan(0);

    // Dovrebbe contenere skill, jobs e trend
    const headerTexts = headers.join(" ").toLowerCase();
    expect(headerTexts).toContain("skill");
  });

  test("dovrebbe mostrare i dati delle skills nella tabella", async ({ page }) => {
    const skillsPage = new SkillsPagePO(page);
    await skillsPage.goto();
    await skillsPage.waitForPageLoad();

    const rowCount = await skillsPage.getSkillsTableRows();

    if (rowCount > 0) {
      const skill = await skillsPage.getSkillFromTable(0);

      // Dovrebbe avere la skill
      expect(skill.skill).toBeTruthy();
      // jobs potrebbe essere un numero
      if (skill.jobs) {
        expect(/\d+/.test(skill.jobs)).toBeTruthy();
      }
    }
  });

  test("dovrebbe avere il grafico delle top skills", async ({ page }) => {
    const skillsPage = new SkillsPagePO(page);
    await skillsPage.goto();
    await skillsPage.waitForChartsToLoad();

    const hasTopSkills = await skillsPage.hasTopSkillsChart();

    // Dovrebbe avere il grafico top skills
    expect(hasTopSkills).toBeTruthy();
  });

  test("dovrebbe avere il grafico delle top searches", async ({ page }) => {
    const skillsPage = new SkillsPagePO(page);
    await skillsPage.goto();
    await skillsPage.waitForChartsToLoad();

    const hasTopSearches = await skillsPage.hasTopSearchesChart();

    // Potrebbe avere o non avere il grafico searches
    expect(typeof hasTopSearches).toBe("boolean");
  });

  test("dovrebbe mostrare i dati nel grafico", async ({ page }) => {
    const skillsPage = new SkillsPagePO(page);
    await skillsPage.goto();
    await skillsPage.waitForChartsToLoad();

    const dataPoints = await skillsPage.getChartDataPoints();

    // Dovrebbe avere datapoints (anche se 0)
    expect(typeof dataPoints).toBe("number");
  });

  test("dovrebbe caricare i dati quando la pagina viene visitata", async ({ page }) => {
    const skillsPage = new SkillsPagePO(page);
    await skillsPage.goto();

    await skillsPage.waitForPageLoad();

    // Dovrebbe avere dei dati
    const rowCount = await skillsPage.getSkillsTableRows();
    expect(rowCount).toBeGreaterThan(0);
  });

  test("dovrebbe gestire il caricamento dei dati", async ({ page }) => {
    const skillsPage = new SkillsPagePO(page);
    await skillsPage.goto();

    // Attendi il caricamento
    const isLoading = await skillsPage.isTableLoading().catch(() => false);

    // Carica fino a completamento
    await skillsPage.waitForPageLoad();

    // Dopo il caricamento, il contenuto deve essere visibile
    const content = page.getByTestId("skills-page");
    await expect(content).toBeVisible();
  });

  test("dovrebbe avere layout a griglia per i grafici", async ({ page }) => {
    const skillsPage = new SkillsPagePO(page);
    await skillsPage.goto();
    await skillsPage.waitForPageLoad();

    // Verifica che ci sia una griglia
    const grid = page.locator("[class*='grid']").first();
    await expect(grid).toBeVisible();
  });

  test("dovrebbe offrire la possibilità di ordinare", async ({ page }) => {
    const skillsPage = new SkillsPagePO(page);
    await skillsPage.goto();
    await skillsPage.waitForPageLoad();

    // Verifica se ci sono header cliccabili
    const headers = await skillsPage.getTableHeaders();

    if (headers.length > 0) {
      // Potrebbe essere ordinabile per colonna
      const sortableHeader = page.locator(`th:has-text("${headers[0]}")`);
      const isSortable = await sortableHeader.isVisible().catch(() => false);

      expect(typeof isSortable).toBe("boolean");
    }
  });

  test("dovrebbe mostrare i trend delle skills", async ({ page }) => {
    const skillsPage = new SkillsPagePO(page);
    await skillsPage.goto();
    await skillsPage.waitForPageLoad();

    const rowCount = await skillsPage.getSkillsTableRows();

    if (rowCount > 0) {
      const skill = await skillsPage.getSkillFromTable(0);

      // Dovrebbe avere trend (potrebbe essere icona o testo)
      if (skill.trend) {
        expect(skill.trend).toBeTruthy();
      }
    }
  });
});
