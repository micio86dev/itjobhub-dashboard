import type { Page } from "@playwright/test";

export class LoginPagePO {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto("/login");
  }

  async fillEmail(email: string): Promise<void> {
    await this.page.getByTestId("email").fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.page.getByTestId("password").fill(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.page.getByTestId("login-btn").click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.page.getByRole("button", { name: /show|hide password/i }).click();
  }

  async getEmailInput(): Promise<string> {
    return this.page.getByTestId("email").inputValue();
  }

  async getPasswordInput(): Promise<string> {
    return this.page.getByTestId("password").inputValue();
  }

  async getErrorMessage(): Promise<string | null> {
    const errorElement = this.page.getByTestId("login-error");
    const isVisible = await errorElement.isVisible();
    return isVisible ? errorElement.textContent() : null;
  }

  async getEmailErrorMessage(): Promise<string | null> {
    const emailError = this.page.locator("text=/auth.errors.email/");
    const isErr = await emailError.isVisible();
    return isErr ? emailError.textContent() : null;
  }

  async getPasswordErrorMessage(): Promise<string | null> {
    const passwordError = this.page.locator("text=/auth.errors.password/");
    const isPwd = await passwordError.isVisible();
    return isPwd ? passwordError.textContent() : null;
  }

  async isLoginButtonDisabled(): Promise<boolean> {
    return this.page.getByTestId("login-btn").isDisabled();
  }

  async waitForTitle(title: string): Promise<void> {
    await this.page.locator(`h2:has-text("${title}")`).waitFor();
  }
}
