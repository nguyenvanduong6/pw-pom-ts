import { expect, Locator, Page } from '@playwright/test';

export default class LoginPage {
  emailTxb: Locator;
  passwordTxb: Locator;
  loginBtn: Locator;
  loginTitleLbl: Locator;

  constructor(public page: Page) {
    this.loginTitleLbl = page.locator('div.login-form h2');
    this.emailTxb = page.locator('input[data-qa="login-email"]');
    this.passwordTxb = page.locator('input[data-qa="login-password"]');
    this.loginBtn = page.locator('button[data-qa="login-button"]');
  }

  async goTo() {
    await this.page.goto('login');
  }

  async isDisplayLoginPage() {
    await expect(this.loginTitleLbl).toHaveText('Login to your account');
  }

  async inputEmail(email: string) {
    await this.emailTxb.fill(email);
  }

  async inputPassword(password: string) {
    await this.passwordTxb.fill(password);
  }

  async clickLoginButton() {
    await Promise.all([this.page.waitForURL('/'), await this.loginBtn.click()]);
  }

  async isLoginSuccess() {
    await expect(this.page.getByText('Logged in as Finn')).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.inputEmail(email);
    await this.inputPassword(password);
    await this.clickLoginButton();
  }
}
