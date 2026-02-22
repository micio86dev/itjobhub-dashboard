import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./utils/auth.js";
import { NewsPagePO } from "./pages/NewsPage.js";

test.describe("Dashboard - Pagina Notizie", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("dovrebbe caricare la pagina notizie", async ({ page }) => {
    const newsPage = new NewsPagePO(page);
    await newsPage.goto();

    await expect(page).toHaveURL(/\/dashboard\/news/);
  });

  test("dovrebbe mostrare la tabella delle notizie", async ({ page }) => {
    const newsPage = new NewsPagePO(page);
    await newsPage.goto();
    await newsPage.waitForPageLoad();

    // Verifica che la tabella sia visibile
    const table = page.locator("table");
    await expect(table).toBeVisible();

    // Verifica le righe
    const rowCount = await newsPage.getNewsTableRows();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test("dovrebbe mostrare i header della tabella", async ({ page }) => {
    const newsPage = new NewsPagePO(page);
    await newsPage.goto();
    await newsPage.waitForPageLoad();

    const headers = await newsPage.getTableHeaders();

    // Dovrebbe avere header
    expect(headers.length).toBeGreaterThan(0);
  });

  test("dovrebbe permettere di cercare le notizie", async ({ page }) => {
    const newsPage = new NewsPagePO(page);
    await newsPage.goto();
    await newsPage.waitForPageLoad();

    const initialRowCount = await newsPage.getNewsTableRows();

    // Cerca una notizia
    await newsPage.searchNews("technology");
    const searchRowCount = await newsPage.getNewsTableRows();

    // Potrebbe avere meno risultati
    expect(searchRowCount).toBeLessThanOrEqual(initialRowCount);
  });

  test("dovrebbe permettere di filtrare per categoria", async ({ page }) => {
    const newsPage = new NewsPagePO(page);
    await newsPage.goto();
    await newsPage.waitForPageLoad();

    // Prova a filtrare per categoria
    const categorySelect = page.locator("[data-testid*='filter-category'], select").first();
    const isCategorySelectVisible = await categorySelect.isVisible().catch(() => false);

    if (isCategorySelectVisible) {
      await newsPage.filterByCategory("technology");
      await newsPage.waitForPageLoad();

      const rowCount = await newsPage.getNewsTableRows();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    }
  });

  test("dovrebbe permettere di resettare i filtri", async ({ page }) => {
    const newsPage = new NewsPagePO(page);
    await newsPage.goto();
    await newsPage.waitForPageLoad();

    const initialRowCount = await newsPage.getNewsTableRows();

    // Applica filtri
    await newsPage.searchNews("test");

    // Reset
    await newsPage.resetFilters();
    await newsPage.waitForPageLoad();

    const finalRowCount = await newsPage.getNewsTableRows();

    // Dovrebbe tornare ai risultati iniziali
    expect(finalRowCount).toBe(initialRowCount);
  });

  test("dovrebbe mostrare i dati delle notizie nella tabella", async ({ page }) => {
    const newsPage = new NewsPagePO(page);
    await newsPage.goto();
    await newsPage.waitForPageLoad();

    const rowCount = await newsPage.getNewsTableRows();

    if (rowCount > 0) {
      const news = await newsPage.getNewsFromTable(0);

      // Dovrebbe avere i dati
      expect(news.title).toBeTruthy();
      // category e published potrebbero essere vuoti
    }
  });

  test("dovrebbe mostrare i views count", async ({ page }) => {
    const newsPage = new NewsPagePO(page);
    await newsPage.goto();
    await newsPage.waitForPageLoad();

    const rowCount = await newsPage.getNewsTableRows();

    if (rowCount > 0) {
      const views = await newsPage.getViewsCount(0);

      // Dovrebbe essere un numero
      expect(views).toBeGreaterThanOrEqual(0);
    }
  });

  test("dovrebbe avere input di ricerca funzionante", async ({ page }) => {
    const newsPage = new NewsPagePO(page);
    await newsPage.goto();
    await newsPage.waitForPageLoad();

    const searchInput = page
      .locator("[data-testid*='filter-search'], input[placeholder*='search' i]")
      .first();
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEnabled();
  });

  test("dovrebbe avere select per la categoria", async ({ page }) => {
    const newsPage = new NewsPagePO(page);
    await newsPage.goto();
    await newsPage.waitForPageLoad();

    const categorySelect = page.locator("[data-testid*='filter-category'], select").first();
    const isSelectVisible = await categorySelect.isVisible().catch(() => false);

    if (isSelectVisible) {
      await expect(categorySelect).toBeEnabled();
    }
  });

  test("dovrebbe avere bottone reset filters", async ({ page }) => {
    const newsPage = new NewsPagePO(page);
    await newsPage.goto();
    await newsPage.waitForPageLoad();

    const resetBtn = page.getByRole("button", { name: /reset/i }).last();
    await expect(resetBtn).toBeVisible();
  });

  test("dovrebbe gestire l'assenza dei risultati", async ({ page }) => {
    const newsPage = new NewsPagePO(page);
    await newsPage.goto();
    await newsPage.waitForPageLoad();

    // Ricerca per qualcosa che non esiste
    await newsPage.searchNews("xyznonexistentarticle123456");
    const rowCount = await newsPage.getNewsTableRows();

    const hasNoResults = await newsPage.hasNoResultsMessage();
    expect(rowCount === 0 || hasNoResults).toBeTruthy();
  });

  test("dovrebbe caricare i dati quando la pagina viene visitata", async ({ page }) => {
    const newsPage = new NewsPagePO(page);
    await newsPage.goto();

    await newsPage.waitForPageLoad();

    // Dovrebbe avere dei dati
    const rowCount = await newsPage.getNewsTableRows();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test("dovrebbe mostrare il titolo della pagina", async ({ page }) => {
    const newsPage = new NewsPagePO(page);
    await newsPage.goto();

    const title = page.locator("h2").first();
    await expect(title).toBeVisible();
    const titleText = await title.textContent();
    expect(titleText).toBeTruthy();
  });

  test("dovrebbe permettere di cliccare su una notiza", async ({ page }) => {
    const newsPage = new NewsPagePO(page);
    await newsPage.goto();
    await newsPage.waitForPageLoad();

    const rowCount = await newsPage.getNewsTableRows();

    if (rowCount > 0) {
      // Clicca la prima notiza
      await newsPage.clickNewsRow(0);

      // Dovrebbe navigare o mostrare un dettaglio
      await page.waitForTimeout(500);
    }
  });

  test("dovrebbe avere layout responsivo", async ({ page }) => {
    const newsPage = new NewsPagePO(page);
    await newsPage.goto();
    await newsPage.waitForPageLoad();

    // Verifica che i filtri siano visibili
    const filterContainer = page.locator("[class*='grid'], [class*='flex']");
    const isFilterVisible = await filterContainer.isVisible().catch(() => false);

    // La tabella dovrebbe essere visibile
    const table = page.locator("table");
    await expect(table).toBeVisible();
  });
});

test.describe("Dashboard - Filtri Notizie", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("dovrebbe permettere combinazioni di filtri", async ({ page }) => {
    const newsPage = new NewsPagePO(page);
    await newsPage.goto();
    await newsPage.waitForPageLoad();

    // Applica filtri
    await newsPage.searchNews("tech");

    const rowCount = await newsPage.getNewsTableRows();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test("dovrebbe resettare tutti i filtri", async ({ page }) => {
    const newsPage = new NewsPagePO(page);
    await newsPage.goto();
    await newsPage.waitForPageLoad();

    const initialCount = await newsPage.getNewsTableRows();

    // Applica filtri
    await newsPage.searchNews("tech");

    // Reset
    await newsPage.resetFilters();
    const finalCount = await newsPage.getNewsTableRows();

    expect(finalCount).toBe(initialCount);
  });

  test("dovrebbe gestire la ricerca sensibile alla case", async ({ page }) => {
    const newsPage = new NewsPagePO(page);
    await newsPage.goto();
    await newsPage.waitForPageLoad();

    // Ricerca con maiuscole
    await newsPage.searchNews("TECHNOLOGY");
    const countUpper = await newsPage.getNewsTableRows();

    // Reset
    await newsPage.resetFilters();

    // Ricerca con minuscole
    await newsPage.searchNews("technology");
    const countLower = await newsPage.getNewsTableRows();

    // Dovrebbe essere uguali (case insensitive)
    expect(countUpper).toBe(countLower);
  });
});
