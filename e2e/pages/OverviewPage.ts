import type { Page } from "@playwright/test";
import { DashboardLayoutPO } from "./DashboardLayout.js";

export class OverviewPagePO extends DashboardLayoutPO {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigateTo("/dashboard");
  }

  async getStatCards(): Promise<{ title: string; value: string }[]> {
    const cards = await this.page.locator("[data-testid='stat-card']").all();
    const stats: { title: string; value: string }[] = [];

    for (const card of cards) {
      const title = await card.locator("h3, .stat-title").textContent();
      const value = await card.locator(".stat-value, [class*='text-2xl']").textContent();
      if (title && value) {
        stats.push({ title: title.trim(), value: value.trim() });
      }
    }

    return stats;
  }

  async waitForChartsToLoad(): Promise<void> {
    await this.waitForContentLoad();
    // Attendi i grafici principali
    const charts = this.page.locator("[role='img']").or(this.page.locator("canvas"));
    const chartCount = await charts.count();
    if (chartCount > 0) {
      await charts.first().waitFor();
    }
  }

  async getTopSkillsList(): Promise<string[]> {
    const skills = await this.page
      .locator("[data-testid='top-skills'] li, [data-testid='skill-item']")
      .all();
    const skillNames: string[] = [];

    for (const skill of skills) {
      const text = await skill.textContent();
      if (text) {
        skillNames.push(text.trim());
      }
    }

    return skillNames;
  }

  async getTopLanguagesList(): Promise<string[]> {
    const languages = await this.page
      .locator("[data-testid='top-languages'] li, [data-testid='language-item']")
      .all();
    const languageNames: string[] = [];

    for (const language of languages) {
      const text = await language.textContent();
      if (text) {
        languageNames.push(text.trim());
      }
    }

    return languageNames;
  }

  async hasRecentJobs(): Promise<boolean> {
    const jobsSection = this.page.locator("[data-testid='recent-jobs']");
    return jobsSection.isVisible();
  }

  async hasRecentUsers(): Promise<boolean> {
    const usersSection = this.page.locator("[data-testid='recent-users']");
    return usersSection.isVisible();
  }
}
