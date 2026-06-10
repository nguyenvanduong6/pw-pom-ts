import { test, expect, BrowserContext, Page } from '@playwright/test';

// test('Verify login successfully', async ({ page }) => {
//   await page.goto('/login');
//   await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').click();
//   await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill('vduomg@gmail.com');
//   await page.getByRole('textbox', { name: 'Password' }).click();
//   await page.getByRole('textbox', { name: 'Password' }).fill('abcd1234');
//   await page.getByRole('button', { name: 'Login' }).click();
//   await expect(page.getByText('Logged in as Finn')).toBeVisible();
// });

test.describe.serial('Verify login successfully', () => {
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
  });

  test('Given user open login screen', async () => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
  });

  test('When user perform login steps', async () => {
    await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').click();
    await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill('vduomg@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('abcd1234');
    await page.getByRole('button', { name: 'Login' }).click();
  });

  test('Then user login successfully', async () => {
    await expect(page.getByText('Logged in as Finn')).toBeVisible();
  });

  test.afterAll(async () => {
    await context.close();
  });
});

test('Verify login successfully', async ({ page }) => {
  await test.step('Given user open login screen', async () => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
  });

  await test.step('When user perform login steps', async () => {
    await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').click();
    await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill('vduomg@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('abcd1234');
    await page.getByRole('button', { name: 'Login' }).click();
  });

  await test.step('Then user login successfully', async () => {
    await expect(page.getByText('Logged in as Finn')).toBeVisible();
  });
});
