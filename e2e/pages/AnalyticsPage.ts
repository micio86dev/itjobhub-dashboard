import type { Page } from "@playwright/test";
import { DashboardLayoutPO } from "./DashboardLayout.js";

export class AnalyticsPagePO extends DashboardLayoutPO {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigateTo("/dashboard/analytics");
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.getByTestId("analytics-page").waitFor();
    await this.waitForContentLoad();
  }

  async waitForChartsToLoad(): Promise<void> {
    // Attendi i grafici
    const charts = this.page.locator("canvas, [role='img']");
    const chartCount = await charts.count();
    if (chartCount > 0) {
      await charts.first().waitFor();
    }
  }

  async hasLineChart(): Promise<boolean> {
    return this.page.locator("canvas, [class*='LineChart']").isVisible();
  }

  async hasBarChart(): Promise<boolean> {
    return this.page.locator("canvas, [class*='BarChart']").isVisible();
  }

  async hasHeatmapChart(): Promise<boolean> {
    return this.page.locator("canvas, [class*='HeatmapChart']").isVisible();
  }

  async getChartTitles(): Promise<string[]> {
    const titles = await this.page.locator("[class*='title'], h3, h4").all();
    const chartTitles: string[] = [];

    for (const title of titles) {
      const text = await title.textContent();
      if (text && text.trim().length > 0) {
        chartTitles.push(text.trim());
      }
    }

    return chartTitles;
  }

  async getGridColumns(): Promise<number> {
    const grid = this.page.locator("[class*='grid']").first();
    const gridClass = await grid.getAttribute("class");
    const match = gridClass?.match(/lg:grid-cols-(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  async export(): Promise<void> {
    await this.clickExportButton();
  }
}
