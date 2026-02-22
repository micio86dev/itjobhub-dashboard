import type { Page } from "@playwright/test";
import { DashboardLayoutPO } from "./DashboardLayout.js";

export class UsersPagePO extends DashboardLayoutPO {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigateTo("/dashboard/users");
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.getByTestId("users-page").waitFor();
    await this.waitForContentLoad();
  }

  async searchUser(query: string): Promise<void> {
    await this.page.getByTestId("users-filter-search").fill(query);
    await this.waitForContentLoad();
  }

  async clearSearchUser(): Promise<void> {
    await this.page.getByTestId("users-filter-search").clear();
    await this.waitForContentLoad();
  }

  async filterByLoginMethod(method: string): Promise<void> {
    await this.page.getByTestId("users-filter-method").click();
    await this.page.getByRole("option", { name: new RegExp(method, "i") }).click();
    await this.waitForContentLoad();
  }

  async setDateFrom(date: string): Promise<void> {
    await this.page.getByTestId("users-filter-date-from").fill(date);
    await this.waitForContentLoad();
  }

  async setDateTo(date: string): Promise<void> {
    await this.page.getByTestId("users-filter-date-to").fill(date);
    await this.waitForContentLoad();
  }

  async resetFilters(): Promise<void> {
    await this.page.getByTestId("users-filter-reset").click();
    await this.waitForContentLoad();
  }

  async getUsersTableRows(): Promise<number> {
    return this.page.locator("tbody tr").count();
  }

  async getUserFromTable(index: number): Promise<{ email: string; method: string }> {
    const row = this.page.locator("tbody tr").nth(index);
    const email = await row.locator("td").nth(0).textContent();
    const method = await row.locator("td").nth(1).textContent();
    return { email: email?.trim() || "", method: method?.trim() || "" };
  }

  async hasNoResultsMessage(): Promise<boolean> {
    return this.page.locator("text=/no results|no users found/i").isVisible();
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

  async sortByColumn(columnName: string): Promise<void> {
    await this.page.getByRole("button", { name: new RegExp(columnName, "i") }).click();
    await this.waitForContentLoad();
  }
}
