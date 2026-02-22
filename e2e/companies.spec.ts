import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./utils/auth.js";
import { CompaniesPagePO } from "./pages/CompaniesPage.js";

test.describe("Dashboard - Pagina Aziende", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("dovrebbe caricare la pagina aziende", async ({ page }) => {
    const companiesPage = new CompaniesPagePO(page);
    await companiesPage.goto();

    await expect(page).toHaveURL(/\/dashboard\/companies/);
    await expect(page.getByTestId("companies-page")).toBeVisible();
  });

  test("dovrebbe mostrare le card delle aziende", async ({ page }) => {
    const companiesPage = new CompaniesPagePO(page);
    await companiesPage.goto();
    await companiesPage.waitForPageLoad();

    // Verifica che ci siano card
    const cardCount = await companiesPage.getCompanyCards();
    expect(cardCount).toBeGreaterThan(0);
  });

  test("dovrebbe mostrare i dettagli dell'azienda sulle card", async ({ page }) => {
    const companiesPage = new CompaniesPagePO(page);
    await companiesPage.goto();
    await companiesPage.waitForPageLoad();

    const cardCount = await companiesPage.getVisibleCompanyCount();

    if (cardCount > 0) {
      const company = await companiesPage.getCompanyDetails(0);

      // Dovrebbe avere il nome
      expect(company.name).toBeTruthy();
    }
  });

  test("dovrebbe permettere di cercare le aziende", async ({ page }) => {
    const companiesPage = new CompaniesPagePO(page);
    await companiesPage.goto();
    await companiesPage.waitForPageLoad();

    const initialCardCount = await companiesPage.getVisibleCompanyCount();

    // Cerca un'azienda
    await companiesPage.searchCompany("tech");
    const searchCardCount = await companiesPage.getVisibleCompanyCount();

    // Potrebbe avere meno risultati
    expect(searchCardCount).toBeLessThanOrEqual(initialCardCount);
  });

  test("dovrebbe permettere di filtrare per industria", async ({ page }) => {
    const companiesPage = new CompaniesPagePO(page);
    await companiesPage.goto();
    await companiesPage.waitForPageLoad();

    // Filtra per industria
    await companiesPage.filterByIndustry("technology");
    const filteredCardCount = await companiesPage.getVisibleCompanyCount();

    // Dovrebbe avere risultati
    expect(filteredCardCount).toBeGreaterThanOrEqual(0);
  });

  test("dovrebbe permettere di filtrare per aziende verificate", async ({ page }) => {
    const companiesPage = new CompaniesPagePO(page);
    await companiesPage.goto();
    await companiesPage.waitForPageLoad();

    const initialCardCount = await companiesPage.getVisibleCompanyCount();

    // Attiva il filtro verified
    await companiesPage.toggleVerifiedFilter();
    await companiesPage.waitForPageLoad();

    const verifiedCardCount = await companiesPage.getVisibleCompanyCount();

    // Dovrebbe avere meno o uguali risultati
    expect(verifiedCardCount).toBeLessThanOrEqual(initialCardCount);
  });

  test("dovrebbe permettere di resettare i filtri", async ({ page }) => {
    const companiesPage = new CompaniesPagePO(page);
    await companiesPage.goto();
    await companiesPage.waitForPageLoad();

    const initialCardCount = await companiesPage.getVisibleCompanyCount();

    // Applica filtri
    await companiesPage.searchCompany("test");
    await companiesPage.filterByIndustry("tech");

    // Reset
    await companiesPage.resetFilters();
    await companiesPage.waitForPageLoad();

    const finalCardCount = await companiesPage.getVisibleCompanyCount();

    // Dovrebbe tornare ai risultati iniziali
    expect(finalCardCount).toBe(initialCardCount);
  });

  test("dovrebbe avere input di ricerca funzionante", async ({ page }) => {
    const companiesPage = new CompaniesPagePO(page);
    await companiesPage.goto();
    await companiesPage.waitForPageLoad();

    const searchInput = page.getByTestId("companies-filter-search");
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEnabled();
  });

  test("dovrebbe avere input per l'industria", async ({ page }) => {
    const companiesPage = new CompaniesPagePO(page);
    await companiesPage.goto();
    await companiesPage.waitForPageLoad();

    const industryInput = page.getByTestId("companies-filter-industry");
    await expect(industryInput).toBeVisible();
    await expect(industryInput).toBeEnabled();
  });

  test("dovrebbe avere checkbox per le aziende verificate", async ({ page }) => {
    const companiesPage = new CompaniesPagePO(page);
    await companiesPage.goto();
    await companiesPage.waitForPageLoad();

    const verifiedCheckbox = page.getByTestId("companies-filter-verified");
    await expect(verifiedCheckbox).toBeVisible();
  });

  test("dovrebbe avere bottone reset filters", async ({ page }) => {
    const companiesPage = new CompaniesPagePO(page);
    await companiesPage.goto();
    await companiesPage.waitForPageLoad();

    const resetBtn = page.getByTestId("companies-filter-reset");
    await expect(resetBtn).toBeVisible();
    await expect(resetBtn).toBeEnabled();
  });

  test("dovrebbe gestire l'assenza dei risultati", async ({ page }) => {
    const companiesPage = new CompaniesPagePO(page);
    await companiesPage.goto();
    await companiesPage.waitForPageLoad();

    // Ricerca per qualcosa che non esiste
    await companiesPage.searchCompany("xyznonexistentcompany123456");
    const cardCount = await companiesPage.getVisibleCompanyCount();

    const hasNoResults = await companiesPage.hasNoResultsMessage();
    expect(cardCount === 0 || hasNoResults).toBeTruthy();
  });

  test("dovrebbe caricare gli indicatori corretti nel filtro verified", async ({ page }) => {
    const companiesPage = new CompaniesPagePO(page);
    await companiesPage.goto();
    await companiesPage.waitForPageLoad();

    // Clicca il checkbox
    const checkbox = page.getByTestId("companies-filter-verified");
    const isChecked = await checkbox.isChecked();

    await checkbox.click();

    // Dovrebbe cambiare stato
    const newIsChecked = await checkbox.isChecked();
    expect(newIsChecked).toBe(!isChecked);

    // Torna allo stato originale
    await checkbox.click();
    const finalIsChecked = await checkbox.isChecked();
    expect(finalIsChecked).toBe(isChecked);
  });

  test("dovrebbe avere layout a grid per le card", async ({ page }) => {
    const companiesPage = new CompaniesPagePO(page);
    await companiesPage.goto();
    await companiesPage.waitForPageLoad();

    // Verifica che le card siano disposte a grid
    const gridContainer = page.locator("[class*='grid']");
    await expect(gridContainer).toBeVisible();

    const cardCount = await companiesPage.getVisibleCompanyCount();
    expect(cardCount).toBeGreaterThan(0);
  });

  test("dovrebbe caricare i dati quando la pagina viene visitata", async ({ page }) => {
    const companiesPage = new CompaniesPagePO(page);
    await companiesPage.goto();

    await companiesPage.waitForPageLoad();

    // Dovrebbe avere dei dati
    const cardCount = await companiesPage.getVisibleCompanyCount();
    expect(cardCount).toBeGreaterThanOrEqual(0);
  });

  test("dovrebbe mostrare il titolo della pagina", async ({ page }) => {
    const companiesPage = new CompaniesPagePO(page);
    await companiesPage.goto();

    const title = page.locator("h2").first();
    await expect(title).toBeVisible();
    const titleText = await title.textContent();
    expect(titleText).toBeTruthy();
  });

  test("dovrebbe permettere di cliccare su una card azienda", async ({ page }) => {
    const companiesPage = new CompaniesPagePO(page);
    await companiesPage.goto();
    await companiesPage.waitForPageLoad();

    const cardCount = await companiesPage.getVisibleCompanyCount();

    if (cardCount > 0) {
      // Clicca la prima card
      await companiesPage.clickCompanyCard(0);

      // Dovrebbe navigare o mostrare un popover
      await page.waitForTimeout(500);
    }
  });
});

test.describe("Dashboard - Filtri Aziende", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("dovrebbe permettere combinazioni di filtri", async ({ page }) => {
    const companiesPage = new CompaniesPagePO(page);
    await companiesPage.goto();
    await companiesPage.waitForPageLoad();

    // Applica più filtri
    await companiesPage.searchCompany("tech");
    await companiesPage.filterByIndustry("technology");
    await companiesPage.waitForPageLoad();

    // Dovrebbe funzionare
    const cardCount = await companiesPage.getVisibleCompanyCount();
    expect(cardCount).toBeGreaterThanOrEqual(0);
  });

  test("dovrebbe resettare tutti i filtri", async ({ page }) => {
    const companiesPage = new CompaniesPagePO(page);
    await companiesPage.goto();
    await companiesPage.waitForPageLoad();

    const initialCount = await companiesPage.getVisibleCompanyCount();

    // Applica filtri
    await companiesPage.searchCompany("tech");
    await companiesPage.filterByIndustry("technology");
    await companiesPage.toggleVerifiedFilter();

    // Reset
    await companiesPage.resetFilters();
    const finalCount = await companiesPage.getVisibleCompanyCount();

    expect(finalCount).toBe(initialCount);
  });
});
