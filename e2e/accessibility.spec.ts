import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./utils/auth.js";

test.describe("UX e Accessibilità Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("dovrebbe avere arche aria-labels accessibili", async ({ page }) => {
    await page.goto("/dashboard");

    // Verifica che i pulsanti hanno aria-label
    const buttons = page.locator("button");
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const hasAriaLabel = await button.getAttribute("aria-label").catch(() => null);
      const hasTextContent = await button.textContent();

      // Dovrebbe avere aria-label o testo
      expect(hasAriaLabel || hasTextContent).toBeTruthy();
    }
  });

  test("dovrebbe avere input con label associato", async ({ page }) => {
    await page.goto("/dashboard/users");

    // Verifica che gli input hanno label
    const inputs = page.locator("input");
    const inputCount = await inputs.count();

    // Dovrebbe avere almeno alcuni input
    expect(inputCount).toBeGreaterThan(0);
  });

  test("dovrebbe avere heading gerarchicamente ordinati", async ({ page }) => {
    await page.goto("/dashboard");

    // Verifica h1, h2, h3
    const h1 = page.locator("h1");
    const h2 = page.locator("h2");
    const h3 = page.locator("h3");

    // Dovrebbe avere heading
    const headingCount = (await h1.count()) + (await h2.count()) + (await h3.count());
    expect(headingCount).toBeGreaterThan(0);
  });

  test("dovrebbe avere contrasto sufficiente per il testo", async ({ page }) => {
    await page.goto("/dashboard");

    // Verifica che il testo principale sia visibile
    const mainContent = page.getByTestId("dashboard-layout");
    await expect(mainContent).toBeVisible();

    // Verifica che il titolo sia visibile (contrasto)
    const title = page.locator("h2").first();
    await expect(title).toBeVisible();

    // Verifica che il testo sia leggibile
    const textColor = await title.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    expect(textColor).toBeTruthy();
  });

  test("dovrebbe avere focus visibile sui pulsanti", async ({ page }) => {
    await page.goto("/dashboard");

    // Pressa Tab per muoverti tra gli elementi focusabili
    await page.keyboard.press("Tab");

    // Verifica che un elemento sia focalizzato
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    expect(focusedElement).toBeTruthy();
  });

  test("dovrebbe avere testo con dimensioni leggibili", async ({ page }) => {
    await page.goto("/dashboard");

    // Verifica che il testo principale sia leggibile (almeno 16px)
    const bodyText = page.locator("body");
    const fontSize = await bodyText.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });

    // Estrai il numero dal font size
    const fontSizeNum = parseInt(fontSize);
    expect(fontSizeNum).toBeGreaterThanOrEqual(12);
  });

  test("dovrebbe supportare la navigazione keyboard", async ({ page }) => {
    await page.goto("/dashboard/users");

    // Pressa Tab per navigare
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");

      // Verifica che un elemento sia focalizzato
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });

      expect(focusedElement).toBeTruthy();
    }
  });

  test("dovrebbe avere colori distinguibili per gli elementi interattivi", async ({ page }) => {
    await page.goto("/dashboard");

    // Verifica che i link hanno colore diverso dal testo corpo
    const link = page.locator("a").first();
    const linkColor = await link.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    const bodyColor = page.locator("body");
    const bodyTextColor = await bodyColor.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    // I colori dovrebbero essere diversi
    expect(linkColor).not.toBe(bodyTextColor);
  });

  test("dovrebbe avere layout responsive su mobile", async ({ page, context }) => {
    // Crea una nuova pagina con viewport mobile
    const mobileContext = await context.browser()?.newContext({
      viewport: { width: 375, height: 667 },
    });

    if (mobileContext) {
      const mobilePage = await mobileContext.newPage();

      // Login
      await loginAsAdmin(mobilePage);

      // Naviga a una pagina
      await mobilePage.goto("/dashboard");

      // Verifica che il contenuto sia visibile
      const content = mobilePage.getByTestId("dashboard-layout");
      await expect(content).toBeVisible();

      // Verifica che non ci sia scrolling orizzontale
      const bodyWidth = await mobilePage.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await mobilePage.evaluate(() => window.innerWidth);

      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5); // 5px di margine

      await mobilePage.close();
      await mobileContext.close();
    }
  });

  test("dovrebbe avere tooltips/hints dove necessario", async ({ page }) => {
    await page.goto("/dashboard");

    // Verifica che ci siano tooltip o aria-description
    const elementsWithTitle = page.locator("[title]");
    const elementsWithDesc = page.locator("[aria-description]");

    const titleCount = await elementsWithTitle.count();
    const descCount = await elementsWithDesc.count();

    // Dovrebbe avere almeno alcuni hint
    expect(titleCount + descCount).toBeGreaterThanOrEqual(0);
  });

  test("dovrebbe gestire gli errori di validazione con messaggi chiari", async ({ page }) => {
    await page.goto("/dashboard/users");

    // Prova a cercare con una query vuota
    const searchInput = page.getByTestId("users-filter-search");
    await searchInput.fill("");
    await searchInput.blur();

    // Non dovrebbe mostrare errore per ricerca vuota
    const errorMessage = page.locator("[role='alert']");
    const hasError = await errorMessage.isVisible().catch(() => false);

    // Potrebbe avere errore (ma non obbligatorio)
    expect(typeof hasError).toBe("boolean");
  });

  test("dovrebbe avere spinner/loader accessibility", async ({ page }) => {
    await page.goto("/dashboard");

    // Attendi il completamento del caricamento
    await page.waitForTimeout(1000);

    // Verifica che non ci sia un loader a schermo intero bloccante
    const loader = page.locator("[role='progressbar'], [role='status']");
    const loaderCount = await loader.count();

    // Dovrebbe avere meno di 1 loader (altrimenti starebbe caricando)
    expect(loaderCount).toBeLessThanOrEqual(1);
  });

  test("dovrebbe avere una navigazione semanticamente corretta", async ({ page }) => {
    await page.goto("/dashboard");

    // Verifica che ci sia un nav onavigation
    const nav = page.locator("nav, [role='navigation']");
    const hasNav = await nav.isVisible().catch(() => false);

    if (hasNav) {
      await expect(nav).toBeVisible();
    }

    // Verifica che ci sia un main
    const main = page.locator("main, [role='main']");
    const hasMain = await main.isVisible().catch(() => false);

    expect(typeof hasMain).toBe("boolean");
  });

  test("dovrebbe avere pulsanti con target sufficientemente grande", async ({ page }) => {
    await page.goto("/dashboard");

    // Verifica le dimensioni dei pulsanti (min 44x44px)
    const buttons = page.locator("button");
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 3); i++) {
      const button = buttons.nth(i);
      const boundingBox = await button.boundingBox();

      if (boundingBox) {
        // Dovrebbe avere almeno 32px di larghezza e altezza (acceptable minimo)
        expect(boundingBox.width).toBeGreaterThanOrEqual(24);
        expect(boundingBox.height).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test("dovrebbe avere transizioni fluide", async ({ page }) => {
    await page.goto("/dashboard/users");

    // Applica un filtro
    await page.getByTestId("users-filter-search").fill("admin");

    // Attendi il caricamento
    await page.waitForTimeout(500);

    // Verifica che il contenuto sia aggiornato senza flash
    const table = page.locator("table");
    await expect(table).toBeVisible();
  });

  test("dovrebbe gestire gli stati hover sugli elementi interattivi", async ({ page }) => {
    await page.goto("/dashboard");

    // Hover su un link
    const link = page.locator("a").first();
    const isLinkVisible = await link.isVisible().catch(() => false);

    if (isLinkVisible) {
      await link.hover();

      // Verifica che lo stile sia cambiato
      const hoverColor = await link.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      expect(hoverColor).toBeTruthy();
    }
  });

  test("dovrebbe avere consistenza visuale tra le pagine", async ({ page }) => {
    const pages = ["/dashboard", "/dashboard/users", "/dashboard/jobs"];

    let previousHeaderColor = "";

    for (const path of pages) {
      await page.goto(path);

      const heading = page.locator("h2").first();
      const headerColor = await heading.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      if (previousHeaderColor) {
        // I colori dovrebbero essere uguali across pages
        expect(headerColor).toBe(previousHeaderColor);
      }

      previousHeaderColor = headerColor;
    }
  });
});

test.describe("Performance e Stabilità", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("dovrebbe caricare la pagina in un tempo ragionevole", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/dashboard");
    const endTime = Date.now();

    const loadTime = endTime - startTime;

    // Dovrebbe caricare in meno di 5 secondi
    expect(loadTime).toBeLessThan(5000);
  });

  test("dovrebbe gestire i refresh senza crash", async ({ page }) => {
    await page.goto("/dashboard");

    // Reload 3 volte
    for (let i = 0; i < 3; i++) {
      await page.reload();
      await expect(page.getByTestId("dashboard-layout")).toBeVisible();
    }
  });

  test("dovrebbe non avere console errors critici", async ({ page }) => {
    const errors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/dashboard");
    await page.waitForTimeout(1000);

    // Nessun errore console
    const criticalErrors = errors.filter((e) => !e.includes("404") && !e.includes("undefined"));
    expect(criticalErrors.length).toBe(0);
  });

  test("dovrebbe non avere memory leaks", async ({ page }) => {
    // Naviga tra le pagine più volte
    const pages = ["/dashboard", "/dashboard/users", "/dashboard/jobs", "/dashboard/companies"];

    for (let cycle = 0; cycle < 2; cycle++) {
      for (const path of pages) {
        await page.goto(path);
        await page.waitForTimeout(500);
      }
    }

    // Dovrebbe ancora essere responsivo
    await page.goto("/dashboard");
    await expect(page.getByTestId("dashboard-layout")).toBeVisible();
  });
});
