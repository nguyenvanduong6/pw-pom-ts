import { test, expect } from '../fixtures/fixtures';

test.describe('Home page tests with user authentication', () => {
  test.use({ role: 'user' });

  test('Verify user logged in', async ({ homePage }) => {
    await test.step('Given User open Login screen', async () => {
      await homePage.goTo();
    });

    await test.step('Then User should be logged in', async () => {
      await homePage.isLoggedIn();
    });
  });

  test('Verify test case failed', async ({ homePage }) => {
    await test.step('Given User open Login screen', async () => {
      await homePage.goTo();
    });

    await test.step('Then User should be wrong data logged in', async () => {
      await homePage.isInvalidLoggedIn();
    });
  });
});
