import type { Page } from "@playwright/test";
import { DashboardLayoutPO } from "./DashboardLayout.js";

export class CompaniesPagePO extends DashboardLayoutPO {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigateTo("/dashboard/companies");
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.getByTestId("companies-page").waitFor();
    await this.waitForContentLoad();
  }

  async searchCompany(query: string): Promise<void> {
    await this.page.getByTestId("companies-filter-search").fill(query);
    await this.waitForContentLoad();
  }

  async clearSearch(): Promise<void> {
    await this.page.getByTestId("companies-filter-search").clear();
    await this.waitForContentLoad();
  }

  async filterByIndustry(industry: string): Promise<void> {
    await this.page.getByTestId("companies-filter-industry").fill(industry);
    await this.waitForContentLoad();
  }

  async clearIndustryFilter(): Promise<void> {
    await this.page.getByTestId("companies-filter-industry").clear();
    await this.waitForContentLoad();
  }

  async toggleVerifiedFilter(): Promise<void> {
    await this.page.getByTestId("companies-filter-verified").click();
    await this.waitForContentLoad();
  }

  async resetFilters(): Promise<void> {
    await this.page.getByTestId("companies-filter-reset").click();
    await this.waitForContentLoad();
  }

  async getCompanyCards(): Promise<number> {
    return this.page.locator("[role='img']").or(this.page.locator("h3")).count();
  }

  async getCompanyDetails(index: number): Promise<{ name: string; industry: string }> {
    const cards = await this.page.locator("[class*='Card']").all();
    if (index >= cards.length) {
      return { name: "", industry: "" };
    }

    const card = cards[index];
    const name = await card.locator("h3, .title").textContent();
    const industry = await card.locator(".industry, [class*='subtitle']").textContent();

    return {
      name: name?.trim() || "",
      industry: industry?.trim() || "",
    };
  }

  async hasNoResultsMessage(): Promise<boolean> {
    return this.page.locator("text=/no results|no companies found/i").isVisible();
  }

  async isLoading(): Promise<boolean> {
    return this.page.locator("[role='status']").isVisible();
  }

  async clickCompanyCard(index: number): Promise<void> {
    const cards = await this.page.locator("[class*='Card']").all();
    if (index < cards.length) {
      await cards[index].click();
    }
  }

  async getVisibleCompanyCount(): Promise<number> {
    const cards = await this.page.locator("[class*='Card']").all();
    let count = 0;
    for (const card of cards) {
      if (await card.isVisible()) {
        count++;
      }
    }
    return count;
  }
}
