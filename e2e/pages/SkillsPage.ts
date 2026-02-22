import type { Page } from "@playwright/test";
import { DashboardLayoutPO } from "./DashboardLayout.js";

export class SkillsPagePO extends DashboardLayoutPO {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigateTo("/dashboard/skills");
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.getByTestId("skills-page").waitFor();
    await this.waitForContentLoad();
  }

  async waitForChartsToLoad(): Promise<void> {
    // Attendi i grafici principali
    const charts = this.page.locator("canvas, [role='img']");
    const chartCount = await charts.count();
    if (chartCount > 0) {
      await charts.first().waitFor();
    }
  }

  async hasBarCharts(): Promise<boolean> {
    const charts = this.page.locator("canvas, [class*='BarChart']");
    return (await charts.count()) >= 2;
  }

  async getSkillsTableRows(): Promise<number> {
    return this.page.locator("tbody tr").count();
  }

  async getSkillFromTable(index: number): Promise<{ skill: string; jobs: string; trend: string }> {
    const row = this.page.locator("tbody tr").nth(index);
    const skill = await row.locator("td").nth(0).textContent();
    const jobs = await row.locator("td").nth(1).textContent();
    const trend = await row.locator("td").nth(2).textContent();

    return {
      skill: skill?.trim() || "",
      jobs: jobs?.trim() || "",
      trend: trend?.trim() || "",
    };
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

  async isTableLoading(): Promise<boolean> {
    return this.page.locator("[role='status']").isVisible();
  }

  async hasTopSkillsChart(): Promise<boolean> {
    return this.page.locator("text=/top skills|top jobs/i").isVisible();
  }

  async hasTopSearchesChart(): Promise<boolean> {
    return this.page.locator("text=/top searches|trending/i").isVisible();
  }

  async getChartDataPoints(): Promise<number> {
    // Conta i punti dati nel grafico
    const bars = this.page.locator("[class*='bar'], [class*='column']");
    return bars.count();
  }
}
