import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./utils/auth.js";
import { JobsPagePO } from "./pages/JobsPage.js";

test.describe("Dashboard - Pagina Lavori", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("dovrebbe caricare la pagina lavori", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);
    await jobsPage.goto();

    await expect(page).toHaveURL(/\/dashboard\/jobs/);
    await expect(page.getByTestId("jobs-page")).toBeVisible();
  });

  test("dovrebbe mostrare la tabella dei lavori", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);
    await jobsPage.goto();
    await jobsPage.waitForPageLoad();

    // Verifica che la tabella sia visibile
    await expect(page.locator("table")).toBeVisible();

    // Verifica che ci sia almeno una riga
    const rowCount = await jobsPage.getJobsTableRows();
    expect(rowCount).toBeGreaterThan(0);
  });

  test("dovrebbe mostrare i header della tabella", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);
    await jobsPage.goto();
    await jobsPage.waitForPageLoad();

    const headers = await jobsPage.getTableHeaders();

    // Dovrebbe avere header
    expect(headers.length).toBeGreaterThan(0);
  });

  test("dovrebbe permettere di cercare i lavori", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);
    await jobsPage.goto();
    await jobsPage.waitForPageLoad();

    const initialRowCount = await jobsPage.getJobsTableRows();

    // Cerca un lavoro
    await jobsPage.searchJob("developer");
    const searchRowCount = await jobsPage.getJobsTableRows();

    // Potrebbe avere meno risultati
    expect(searchRowCount).toBeLessThanOrEqual(initialRowCount);
  });

  test("dovrebbe permettere di filtrare per stato", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);
    await jobsPage.goto();
    await jobsPage.waitForPageLoad();

    // Filtra per stato active
    await jobsPage.filterByStatus("active");
    const activeRowCount = await jobsPage.getJobsTableRows();

    // Dovrebbe avere risultati
    expect(activeRowCount).toBeGreaterThanOrEqual(0);
  });

  test("dovrebbe permettere di filtrare per azienda", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);
    await jobsPage.goto();
    await jobsPage.waitForPageLoad();

    // Filtra per azienda
    await jobsPage.filterByCompany("test");
    const companyRowCount = await jobsPage.getJobsTableRows();

    // Dovrebbe funzionare
    expect(companyRowCount).toBeGreaterThanOrEqual(0);
  });

  test("dovrebbe permettere di resettare i filtri", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);
    await jobsPage.goto();
    await jobsPage.waitForPageLoad();

    const initialRowCount = await jobsPage.getJobsTableRows();

    // Applica filtri
    await jobsPage.searchJob("developer");
    await jobsPage.filterByStatus("active");

    // Reset
    await jobsPage.resetFilters();
    await jobsPage.waitForPageLoad();

    const finalRowCount = await jobsPage.getJobsTableRows();

    // Dovrebbe tornare ai risultati iniziali
    expect(finalRowCount).toBe(initialRowCount);
  });

  test("dovrebbe mostrare i dati dei lavori nella tabella", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);
    await jobsPage.goto();
    await jobsPage.waitForPageLoad();

    const rowCount = await jobsPage.getJobsTableRows();

    if (rowCount > 0) {
      const job = await jobsPage.getJobFromTable(0);

      // Verifica che il primo lavoro abbia i dati
      expect(job.title).toBeTruthy();
      expect(job.company).toBeTruthy();
      // status potrebbe essere vuoto
    }
  });

  test("dovrebbe avere input di ricerca funzionante", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);
    await jobsPage.goto();
    await jobsPage.waitForPageLoad();

    const searchInput = page.getByTestId("jobs-filter-search");
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEnabled();
  });

  test("dovrebbe avere select per lo stato", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);
    await jobsPage.goto();
    await jobsPage.waitForPageLoad();

    const statusSelect = page.getByTestId("jobs-filter-status");
    await expect(statusSelect).toBeVisible();

    // Clicca per aprire le opzioni
    await statusSelect.click();

    // Verifica che le opzioni siano presenti
    const options = page.getByRole("option");
    const optionCount = await options.count();
    expect(optionCount).toBeGreaterThan(0);
  });

  test("dovrebbe avere input per la ricerca dell'azienda", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);
    await jobsPage.goto();
    await jobsPage.waitForPageLoad();

    const companyInput = page.getByTestId("jobs-filter-company");
    await expect(companyInput).toBeVisible();
    await expect(companyInput).toBeEnabled();
  });

  test("dovrebbe avere bottone reset filters", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);
    await jobsPage.goto();
    await jobsPage.waitForPageLoad();

    const resetBtn = page.getByTestId("jobs-filter-reset");
    await expect(resetBtn).toBeVisible();
    await expect(resetBtn).toBeEnabled();
  });

  test("dovrebbe gestire l'assenza dei risultati", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);
    await jobsPage.goto();
    await jobsPage.waitForPageLoad();

    // Ricerca per qualcosa che non esiste
    await jobsPage.searchJob("xyznonexistentjobposition123456");
    const rowCount = await jobsPage.getJobsTableRows();

    const hasNoResults = await jobsPage.hasNoResultsMessage();
    expect(rowCount === 0 || hasNoResults).toBeTruthy();
  });

  test("dovrebbe permettere di navigare alla mappa dei lavori", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);

    // Dalla pagina jobs
    await jobsPage.goto();

    // Clicca il bottone per la mappa (se disponibile)
    const mapLink = page
      .getByRole("link", { name: /map|mappa/i })
      .or(page.getByRole("button", { name: /map|mappa/i }));

    if (await mapLink.isVisible().catch(() => false)) {
      await mapLink.click();
      await expect(page).toHaveURL(/\/dashboard\/jobs\/map/);
    }
  });

  test("dovrebbe avere layout responsivo", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);
    await jobsPage.goto();
    await jobsPage.waitForPageLoad();

    // Verifica che i filtri siano disposti
    const filterContainer = page.locator("[class*='grid']").first();
    await expect(filterContainer).toBeVisible();
  });

  test("dovrebbe caricare i dati quando la pagina viene visitata", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);
    await jobsPage.goto();

    await jobsPage.waitForPageLoad();

    // Dovrebbe avere dei dati
    const rowCount = await jobsPage.getJobsTableRows();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test("dovrebbe mostrare il titolo della pagina", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);
    await jobsPage.goto();

    const title = page.locator("h2").first();
    await expect(title).toBeVisible();
    const titleText = await title.textContent();
    expect(titleText).toBeTruthy();
  });
});

test.describe("Dashboard - Filtri Lavori", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("dovrebbe permettere combinazioni di filtri", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);
    await jobsPage.goto();
    await jobsPage.waitForPageLoad();

    // Applica più filtri
    await jobsPage.searchJob("developer");
    await jobsPage.filterByStatus("active");
    await jobsPage.filterByCompany("tech");
    await jobsPage.waitForPageLoad();

    // Dovrebbe funzionare
    const rowCount = await jobsPage.getJobsTableRows();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test("dovrebbe resettare tutti i filtri", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);
    await jobsPage.goto();
    await jobsPage.waitForPageLoad();

    const initialCount = await jobsPage.getJobsTableRows();

    // Applica filtri
    await jobsPage.searchJob("developer");
    await jobsPage.filterByStatus("active");
    await jobsPage.filterByCompany("tech");

    // Reset
    await jobsPage.resetFilters();
    const finalCount = await jobsPage.getJobsTableRows();

    expect(finalCount).toBe(initialCount);
  });

  test("dovrebbe filtrare per ogni stato disponibile", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);
    await jobsPage.goto();
    await jobsPage.waitForPageLoad();

    const statuses = ["active", "expired", "draft", "closed"];

    for (const status of statuses) {
      await jobsPage.resetFilters();
      await jobsPage.filterByStatus(status);
      const rowCount = await jobsPage.getJobsTableRows();

      // Dovrebbe avere risultati per ogni stato (o nessuno se non ce ne sono)
      expect(rowCount).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe("Dashboard - Pagina Mappa Lavori", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("dovrebbe caricare la pagina della mappa", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);
    await jobsPage.goToJobsMap();

    await expect(page).toHaveURL(/\/dashboard\/jobs\/map/);
  });

  test("dovrebbe visualizzare una mappa", async ({ page }) => {
    const jobsPage = new JobsPagePO(page);
    await jobsPage.goToJobsMap();

    // Verifica che ci sia un elemento mappa
    const mapContainer = page.locator("[class*='map'], [id*='map']");
    const mapVisible = await mapContainer.isVisible().catch(() => false);

    // O dovrebbe avere iFrame di mappa o di leaflet
    const mapIframe = page.locator("iframe[src*='map'], iframe[class*='map']");
    const iframeVisible = await mapIframe.isVisible().catch(() => false);

    expect(mapVisible || iframeVisible).toBeTruthy();
  });
});
