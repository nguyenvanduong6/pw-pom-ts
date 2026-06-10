import { test, expect } from '../fixtures/fixtures';

/**
 * Example test using guest role (no authentication) - default role
 */
test('Guest user can view login page', async ({ loginPage, role }) => {
  await test.step('Given guest user opens login screen', async () => {
    await loginPage.goTo();
  });

  await test.step('Then login page should be displayed', async () => {
    await loginPage.isDisplayLoginPage();
  });

  // Verify role is guest
  expect(role).toBe('guest');
});

/**
 * Tests using user role (authenticated as regular user)
 */
test.describe('User role tests', () => {
  test.use({ role: 'user' });

  test('User can access home page', async ({ homePage, role }) => {
    await test.step('Given user opens home page', async () => {
      await homePage.goTo();
    });

    await test.step('Then user should be logged in', async () => {
      await homePage.isLoggedIn();
    });

    expect(role).toBe('user');
  });

  test('User can interact with authenticated page', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/');
    const title = await authenticatedPage.title();
    expect(title).toBeTruthy();
  });
});

/**
 * Tests using admin role (authenticated as admin)
 */
// test.describe('Admin role tests', () => {
//   test.use({ role: 'admin' });
//
//   test('Admin can access home page', async ({ homePage, role }) => {
//     await test.step('Given admin opens home page', async () => {
//       await homePage.goTo();
//     });
//
//     await test.step('Then admin should be logged in', async () => {
//       await homePage.isLoggedIn();
//     });
//
//     expect(role).toBe('admin');
//   });
// });
