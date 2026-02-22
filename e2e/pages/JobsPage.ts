import type { Page } from "@playwright/test";
import { DashboardLayoutPO } from "./DashboardLayout.js";

export class JobsPagePO extends DashboardLayoutPO {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigateTo("/dashboard/jobs");
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.getByTestId("jobs-page").waitFor();
    await this.waitForContentLoad();
  }

  async searchJob(query: string): Promise<void> {
    await this.page.getByTestId("jobs-filter-search").fill(query);
    await this.waitForContentLoad();
  }

  async clearSearch(): Promise<void> {
    await this.page.getByTestId("jobs-filter-search").clear();
    await this.waitForContentLoad();
  }

  async filterByStatus(status: string): Promise<void> {
    await this.page.getByTestId("jobs-filter-status").click();
    await this.page.getByRole("option", { name: new RegExp(status, "i") }).click();
    await this.waitForContentLoad();
  }

  async filterByCompany(company: string): Promise<void> {
    await this.page.getByTestId("jobs-filter-company").fill(company);
    await this.waitForContentLoad();
  }

  async clearCompanyFilter(): Promise<void> {
    await this.page.getByTestId("jobs-filter-company").clear();
    await this.waitForContentLoad();
  }

  async resetFilters(): Promise<void> {
    await this.page.getByTestId("jobs-filter-reset").click();
    await this.waitForContentLoad();
  }

  async getJobsTableRows(): Promise<number> {
    return this.page.locator("tbody tr").count();
  }

  async getJobFromTable(
    index: number,
  ): Promise<{ title: string; company: string; status: string }> {
    const row = this.page.locator("tbody tr").nth(index);
    const title = await row.locator("td").nth(0).textContent();
    const company = await row.locator("td").nth(1).textContent();
    const status = await row.locator("td").nth(2).textContent();
    return {
      title: title?.trim() || "",
      company: company?.trim() || "",
      status: status?.trim() || "",
    };
  }

  async hasNoResultsMessage(): Promise<boolean> {
    return this.page.locator("text=/no results|no jobs found/i").isVisible();
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

  async clickJobRow(index: number): Promise<void> {
    await this.page.locator("tbody tr").nth(index).click();
  }

  async goToJobsMap(): Promise<void> {
    await this.navigateTo("/dashboard/jobs/map");
  }
}
