import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user copies the project link from the menu', async ({ page }) => {
  await page.getByTestId('project-menu').click();
  await page.getByText('Copy link').click();
});

Then('the clipboard holds a {string} link', async ({ page }, fragment: string) => {
  // Read the clipboard back to verify the actual link was written (the action
  // gives no visible confirmation — Asana copies silently).
  await expect(async () => {
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toContain(fragment);
  }).toPass({ timeout: 15_000 });
});
