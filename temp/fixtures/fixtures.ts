import { test as base, BrowserContext, Page } from '@playwright/test';
import LoginPage from '../pages/loginPage';
import HomePage from '../pages/homePage';
import * as fs from 'fs';
import * as path from 'path';

export type UserRole = 'guest' | 'user' | 'admin';

type AuthFixtures = {
  authenticatedContext: BrowserContext;
  authenticatedPage: Page;
  role: UserRole;
};

type PageFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
};

/**
 * Base test with authentication fixtures
 * Provides authenticated context and page based on role
 *
 * Usage:
 *   test('my test', async ({ loginPage }) => { ... }) // uses 'guest' by default
 *   test.use({ role: 'user' });
 *   test('my test', async ({ homePage }) => { ... }) // uses 'user' role
 */
export const test = base.extend<AuthFixtures & PageFixtures>({
  // Role fixture - defaults to 'guest', can be overridden using test.use({ role: 'user' })
  role: async ({}, use, testInfo) => {
    // Get role from test options, default to 'guest'
    const roleOption = (testInfo.project.use as { role?: UserRole }).role;
    const role: UserRole = roleOption || 'guest';
    await use(role);
  },

  // Authenticated context based on role
  authenticatedContext: async ({ browser, role }, use) => {
    let context: BrowserContext;

    if (role === 'guest') {
      // Guest users get a fresh context without authentication
      context = await browser.newContext();
    } else {
      // User and admin use pre-authenticated storage state
      const storageStatePath = path.join(process.cwd(), `.auth/${role}.json`);

      // Check if storage state file exists
      if (!fs.existsSync(storageStatePath)) {
        throw new Error(
          `Storage state file not found for role "${role}" at ${storageStatePath}. ` +
            `Please run "npm run generate-auth" to create authentication states.`,
        );
      }

      context = await browser.newContext({
        storageState: storageStatePath,
      });
    }

    await use(context);
    await context.close();
  },

  // Authenticated page from the authenticated context
  authenticatedPage: async ({ authenticatedContext }, use) => {
    const page = await authenticatedContext.newPage();
    await use(page);
    await page.close();
  },

  // Page fixtures using authenticated page
  loginPage: async ({ authenticatedPage }, use) => {
    const loginPage = new LoginPage(authenticatedPage);
    await use(loginPage);
  },

  homePage: async ({ authenticatedPage }, use) => {
    const homePage = new HomePage(authenticatedPage);
    await use(homePage);
  },
});

export const expect = test.expect;
