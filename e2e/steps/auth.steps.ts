import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

/** Sign in as the seeded test user (creds from .env.local / CI secrets), then
 * wait for the Cognito session to land on the Projects screen. Every
 * account-based flow starts here — reading data before the session is ready
 * would race and silently read as signed-out. */
Given('a signed-in user', async ({ page }) => {
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;
  expect(username, 'TEST_USERNAME must be set').toBeTruthy();
  expect(password, 'TEST_PASSWORD must be set').toBeTruthy();

  await page.goto('/signin');
  await page.getByLabel('Email').fill(username!);
  await page.getByLabel('Password').fill(password!);
  await page.getByTestId('signin-submit').click();

  // Landing on the Home dashboard proves the session resolved (RequireAuth passed).
  await expect(page.getByTestId('home-greeting')).toBeVisible({ timeout: 20_000 });
});

When('the user opens the app', async ({ page }) => {
  await page.goto('/');
});

Then('they are taken to the sign-in flow', async ({ page }) => {
  await expect(page).toHaveURL(/\/(welcome|signin)/, { timeout: 15_000 });
});

Then('they see the welcome screen', async ({ page }) => {
  await expect(page.getByTestId('welcome-signup')).toBeVisible({ timeout: 15_000 });
});
