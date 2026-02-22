import type { Page, Locator } from "@playwright/test";

export class DashboardLayoutPO {
  protected readonly page: Page;
  protected readonly sidebar: Locator;
  protected readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = page.locator("[role='navigation']");
    this.mainContent = page.getByTestId("dashboard-layout");
  }

  async waitForDashboard(): Promise<void> {
    await this.mainContent.waitFor();
  }

  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
    await this.waitForDashboard();
  }

  async clickNavLink(linkName: string): Promise<void> {
    await this.page.getByRole("link", { name: new RegExp(linkName, "i") }).click();
  }

  async getPageTitle(): Promise<string | null> {
    const title = this.page.locator("h2").first();
    const isVisible = await title.isVisible();
    return isVisible ? title.textContent() : null;
  }

  async isLoading(): Promise<boolean> {
    const loadingIndicator = this.page.locator("[role='status']");
    return loadingIndicator.isVisible();
  }

  async waitForContentLoad(): Promise<void> {
    // Attendi che il loading sia completato
    const loadingIndicator = this.page.locator("[role='status']");
    const isLoading = await loadingIndicator.isVisible().catch(() => false);
    if (isLoading) {
      await loadingIndicator.waitFor({ state: "hidden" });
    }
    // Attendi un po' per permettere al contenuto di caricarsi
    await this.page.waitForTimeout(500);
  }

  async getToastMessage(): Promise<string | null> {
    const toast = this.page.locator("[role='alert']").first();
    const isVisible = await toast.isVisible();
    return isVisible ? toast.textContent() : null;
  }

  async logout(): Promise<void> {
    const userMenuBtn = this.page.getByRole("button", { name: /menu|user|profile/i }).last();
    if (await userMenuBtn.isVisible()) {
      await userMenuBtn.click();
    }
    const logoutBtn = this.page.getByRole("menuitem", { name: /logout|sign out|exit/i });
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
    }
  }

  async getPaginationInfo(): Promise<{ currentPage: number; totalPages: number } | null> {
    const paginationText = this.page.locator("[role='navigation'] >> text=/of /i");
    if (!(await paginationText.isVisible().catch(() => false))) {
      return null;
    }
    const text = await paginationText.textContent();
    const match = text?.match(/of (\d+)/);
    return match ? { currentPage: 1, totalPages: parseInt(match[1]) } : null;
  }

  async clickExportButton(): Promise<void> {
    await this.page.getByRole("button", { name: /export/i }).click();
  }
}
