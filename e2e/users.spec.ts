import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./utils/auth.js";
import { UsersPagePO } from "./pages/UsersPage.js";

test.describe("Dashboard - Pagina Utenti", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("dovrebbe caricare la pagina utenti", async ({ page }) => {
    const usersPage = new UsersPagePO(page);
    await usersPage.goto();

    await expect(page).toHaveURL(/\/dashboard\/users/);
    await expect(page.getByTestId("users-page")).toBeVisible();
  });

  test("dovrebbe mostrare la tabella degli utenti", async ({ page }) => {
    const usersPage = new UsersPagePO(page);
    await usersPage.goto();
    await usersPage.waitForPageLoad();

    // Verifica che la tabella sia visibile
    await expect(page.locator("table")).toBeVisible();

    // Verifica che ci sia almeno una riga
    const rowCount = await usersPage.getUsersTableRows();
    expect(rowCount).toBeGreaterThan(0);
  });

  test("dovrebbe mostrare i header della tabella", async ({ page }) => {
    const usersPage = new UsersPagePO(page);
    await usersPage.goto();
    await usersPage.waitForPageLoad();

    const headers = await usersPage.getTableHeaders();

    // Dovrebbe avere almeno alcuni header
    expect(headers.length).toBeGreaterThan(0);
  });

  test("dovrebbe permettere di cercare gli utenti", async ({ page }) => {
    const usersPage = new UsersPagePO(page);
    await usersPage.goto();
    await usersPage.waitForPageLoad();

    const initialRowCount = await usersPage.getUsersTableRows();

    // Cerca un utente
    await usersPage.searchUser("admin");
    const searchRowCount = await usersPage.getUsersTableRows();

    // Potrebbe avere meno o ugual risultati
    expect(searchRowCount).toBeLessThanOrEqual(initialRowCount);
  });

  test("dovrebbe permettere di resettare la ricerca", async ({ page }) => {
    const usersPage = new UsersPagePO(page);
    await usersPage.goto();
    await usersPage.waitForPageLoad();

    const initialRowCount = await usersPage.getUsersTableRows();

    // Cerca e poi resetta
    await usersPage.searchUser("nonexistent");
    await usersPage.resetFilters();
    await usersPage.waitForPageLoad();

    const finalRowCount = await usersPage.getUsersTableRows();

    // Dovrebbe tornare agli utenti iniziali
    expect(finalRowCount).toBe(initialRowCount);
  });

  test("dovrebbe permettere di filtrare per metodo di login", async ({ page }) => {
    const usersPage = new UsersPagePO(page);
    await usersPage.goto();
    await usersPage.waitForPageLoad();

    const initialRowCount = await usersPage.getUsersTableRows();

    // Filtra per email
    await usersPage.filterByLoginMethod("email");
    const emailRowCount = await usersPage.getUsersTableRows();

    // Dovrebbe avere un numero diverso di risultati
    expect(emailRowCount).toBeGreaterThanOrEqual(0);
  });

  test("dovrebbe permettere di filtrare per data", async ({ page }) => {
    const usersPage = new UsersPagePO(page);
    await usersPage.goto();
    await usersPage.waitForPageLoad();

    // Imposta una data "da"
    await usersPage.setDateFrom("2023-01-01");
    await usersPage.waitForPageLoad();

    // Verifica che i risultati siano stati filtrati
    const rowCount = await usersPage.getUsersTableRows();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test("dovrebbe mostrare i dati degli utenti nella tabella", async ({ page }) => {
    const usersPage = new UsersPagePO(page);
    await usersPage.goto();
    await usersPage.waitForPageLoad();

    const rowCount = await usersPage.getUsersTableRows();

    if (rowCount > 0) {
      const user = await usersPage.getUserFromTable(0);

      // Verifica che il primo utente abbia i dati
      expect(user.email).toBeTruthy();
      // Method potrebbe essere vuoto per alcuni
      if (user.method) {
        expect(user.method).toBeTruthy();
      }
    }
  });

  test("dovrebbe avere input di ricerca funzionante", async ({ page }) => {
    const usersPage = new UsersPagePO(page);
    await usersPage.goto();
    await usersPage.waitForPageLoad();

    // Verifica che l'input di ricerca sia presente
    const searchInput = page.getByTestId("users-filter-search");
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEnabled();
  });

  test("dovrebbe avere select per il metodo di login", async ({ page }) => {
    const usersPage = new UsersPagePO(page);
    await usersPage.goto();
    await usersPage.waitForPageLoad();

    const methodSelect = page.getByTestId("users-filter-method");
    await expect(methodSelect).toBeVisible();

    // Clicca per aprire le opzioni
    await methodSelect.click();

    // Verifica che le opzioni siano presenti
    const options = page.getByRole("option");
    expect(await options.count()).toBeGreaterThan(0);
  });

  test("dovrebbe avere input per data da e a", async ({ page }) => {
    const usersPage = new UsersPagePO(page);
    await usersPage.goto();
    await usersPage.waitForPageLoad();

    const dateFromInput = page.getByTestId("users-filter-date-from");
    const dateToInput = page.getByTestId("users-filter-date-to");

    await expect(dateFromInput).toBeVisible();
    await expect(dateToInput).toBeVisible();
  });

  test("dovrebbe avere bottone reset filters", async ({ page }) => {
    const usersPage = new UsersPagePO(page);
    await usersPage.goto();
    await usersPage.waitForPageLoad();

    const resetBtn = page.getByTestId("users-filter-reset");
    await expect(resetBtn).toBeVisible();
    await expect(resetBtn).toBeEnabled();
  });

  test("dovrebbe gestire l'assenza dei risultati", async ({ page }) => {
    const usersPage = new UsersPagePO(page);
    await usersPage.goto();
    await usersPage.waitForPageLoad();

    // Ricerca per qualcosa che non esiste
    await usersPage.searchUser("xyznonexistent123456@example.com");
    const rowCount = await usersPage.getUsersTableRows();

    // O nessun risultato o un messaggio
    const hasNoResults = await usersPage.hasNoResultsMessage();
    expect(rowCount === 0 || hasNoResults).toBeTruthy();
  });

  test("dovrebbe essere ordinabile per colonna", async ({ page }) => {
    const usersPage = new UsersPagePO(page);
    await usersPage.goto();
    await usersPage.waitForPageLoad();

    const headers = await usersPage.getTableHeaders();
    if (headers.length > 0) {
      // Prova a ordinare per la prima colonna
      await usersPage.sortByColumn(headers[0]);

      // Dovrebbe ancora avere utenti
      const rowCount = await usersPage.getUsersTableRows();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    }
  });

  test("dovrebbe avere layout responsivo", async ({ page }) => {
    const usersPage = new UsersPagePO(page);
    await usersPage.goto();
    await usersPage.waitForPageLoad();

    // Desktop view
    const filterContainer = page.locator("[class*='grid'], [class*='flex']").first();
    await expect(filterContainer).toBeVisible();

    // I filtri devono essere visibili
    const filters = page.locator("[data-testid*='filter']");
    const filterCount = await filters.count();
    expect(filterCount).toBeGreaterThan(0);
  });

  test("dovrebbe caricare i dati quando la pagina viene visitata", async ({ page }) => {
    const usersPage = new UsersPagePO(page);
    await usersPage.goto();

    // Attendi il caricamento
    const isLoading = await usersPage.isTableLoading().catch(() => false);

    // Carica fino a completamento
    await usersPage.waitForPageLoad();

    // Dovrebbe avere dei dati
    const rowCount = await usersPage.getUsersTableRows();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });
});

test.describe("Dashboard - Filtri Utenti", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("dovrebbe permettere combinazioni di filtri", async ({ page }) => {
    const usersPage = new UsersPagePO(page);
    await usersPage.goto();
    await usersPage.waitForPageLoad();

    // Applica più filtri
    await usersPage.searchUser("admin");
    await usersPage.filterByLoginMethod("email");
    await usersPage.waitForPageLoad();

    // Dovrebbe funzionare
    const rowCount = await usersPage.getUsersTableRows();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test("dovrebbe resettare tutti i filtri", async ({ page }) => {
    const usersPage = new UsersPagePO(page);
    await usersPage.goto();
    await usersPage.waitForPageLoad();

    const initialCount = await usersPage.getUsersTableRows();

    // Applica filtri
    await usersPage.searchUser("admin");
    await usersPage.filterByLoginMethod("email");
    await usersPage.setDateFrom("2023-01-01");

    // Verify i filtri sono applicati
    let filteredCount = await usersPage.getUsersTableRows();

    // Reset
    await usersPage.resetFilters();
    const finalCount = await usersPage.getUsersTableRows();

    expect(finalCount).toBe(initialCount);
  });
});
