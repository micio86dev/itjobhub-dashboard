import type { Page } from "@playwright/test";
import { DashboardLayoutPO } from "./DashboardLayout.js";

export class NewsPagePO extends DashboardLayoutPO {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigateTo("/dashboard/news");
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.getByTestId("news-page").waitFor();
    await this.waitForContentLoad();
  }

  async searchNews(query: string): Promise<void> {
    const searchInput = this.page
      .locator("[data-testid*='filter-search'], input[placeholder*='search' i]")
      .first();
    await searchInput.fill(query);
    await this.waitForContentLoad();
  }

  async clearSearch(): Promise<void> {
    const searchInput = this.page
      .locator("[data-testid*='filter-search'], input[placeholder*='search' i]")
      .first();
    await searchInput.clear();
    await this.waitForContentLoad();
  }

  async filterByCategory(category: string): Promise<void> {
    const categorySelect = this.page.locator("[data-testid*='filter-category'], select").first();
    await categorySelect.click();
    await this.page.getByRole("option", { name: new RegExp(category, "i") }).click();
    await this.waitForContentLoad();
  }

  async resetFilters(): Promise<void> {
    const resetBtn = this.page.getByRole("button", { name: /reset/i }).last();
    await resetBtn.click();
    await this.waitForContentLoad();
  }

  async getNewsTableRows(): Promise<number> {
    return this.page.locator("tbody tr").count();
  }

  async getNewsFromTable(
    index: number,
  ): Promise<{ title: string; category: string; published: string }> {
    const row = this.page.locator("tbody tr").nth(index);
    const title = await row.locator("td").nth(0).textContent();
    const category = await row.locator("td").nth(1).textContent();
    const published = await row.locator("td").nth(3).textContent();

    return {
      title: title?.trim() || "",
      category: category?.trim() || "",
      published: published?.trim() || "",
    };
  }

  async hasNoResultsMessage(): Promise<boolean> {
    return this.page.locator("text=/no results|no news|no articles/i").isVisible();
  }

  async isTableLoading(): Promise<boolean> {
    return this.page.locator("[role='status']").isVisible();
  }

  async getTableHeaders(): Promise<string[]> {
    const headers = await this.page.locator("thead th").all();
    const headerTexts: string[] = [];

    for (const header of headers) {
      const text = await header.textContent();
      if (text) {
        headerTexts.push(text.trim());
      }
    }

    return headerTexts;
  }

  async clickNewsRow(index: number): Promise<void> {
    await this.page.locator("tbody tr").nth(index).click();
  }

  async getViewsCount(index: number): Promise<number> {
    const row = this.page.locator("tbody tr").nth(index);
    const viewsText = await row.locator("td").nth(4).textContent();
    const views = parseInt(viewsText?.replace(/\D/g, "") || "0");
    return views;
  }
}
