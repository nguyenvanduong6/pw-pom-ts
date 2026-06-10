import { expect, Locator, Page } from '@playwright/test';

export default class HomePage {
  logoutNavItem: Locator;

  constructor(public page: Page) {
    this.logoutNavItem = page.locator('ul.navbar-nav li:nth-of-type(4)');
  }

  async goTo() {
    await this.page.goto('/');
  }

  async isLoggedIn() {
    await expect(this.logoutNavItem).toHaveText('Logout');
    await expect(this.page.getByText('Logged in as Finn')).toBeVisible();
  }

  async isInvalidLoggedIn() {
    await expect(this.logoutNavItem).toHaveText('Wrong text');
    await expect(this.page.getByText('Logged in as Wrong User')).toBeVisible();
  }
}
