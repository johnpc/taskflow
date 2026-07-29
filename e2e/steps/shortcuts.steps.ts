import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user presses {string}', async ({ page }, key: string) => {
  await page.locator('body').press(key);
});

When(
  'the user presses the {string} then {string} shortcut',
  async ({ page }, a: string, b: string) => {
    await page.locator('body').press(a);
    await page.locator('body').press(b);
  },
);

Then('the shortcuts help overlay is visible', async ({ page }) => {
  await expect(page.getByTestId('shortcuts-help')).toBeVisible({ timeout: 15_000 });
});

Then('the shortcut lands on the projects screen', async ({ page }) => {
  await page.waitForURL('**/projects', { timeout: 15_000 });
  // Level-1 heading — Home also has a "Your projects" h2 shortcut header.
  await expect(page.getByRole('heading', { level: 1, name: 'Your projects' })).toBeVisible({
    timeout: 15_000,
  });
});
