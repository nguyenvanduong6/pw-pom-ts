import { test } from '@playwright/test';
import LoginPage from '../pages/loginPage';

const userEmail = process.env.USER_EMAIL!;
const userPassword = process.env.USER_PASSWORD!;

test('Verify login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await test.step('Given user open login screen', async () => {
    await loginPage.goTo();
    await loginPage.isDisplayLoginPage();
  });

  await test.step('When user perform login steps', async () => {
    await loginPage.inputEmail(userEmail);
    await loginPage.inputPassword(userPassword);
    await loginPage.clickLoginButton();
  });

  await test.step('Then user login successfully', async () => {
    await loginPage.isLoginSuccess();
  });
});
