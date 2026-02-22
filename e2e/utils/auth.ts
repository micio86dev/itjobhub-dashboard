import type { Page } from "@playwright/test";

const DEFAULT_ADMIN_EMAIL = "admin_official@itjobhub.com";
const DEFAULT_ADMIN_PASSWORD = "12345Abc$";

export async function loginAsAdmin(page: Page): Promise<void> {
  const email = process.env.E2E_ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;

  await page.goto("/login");
  if (page.url().includes("/dashboard")) {
    return;
  }

  await page.getByTestId("email").fill(email);
  await page.getByTestId("password").fill(password);

  await Promise.all([page.waitForURL("**/dashboard"), page.getByTestId("login-btn").click()]);

  await page.getByTestId("dashboard-layout").waitFor();
}
