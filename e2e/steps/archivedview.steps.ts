import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user expands the archived section', async ({ page }) => {
  await page.getByTestId('archived-toggle').click();
});

Then('an archived project {string} is listed', async ({ page }, name: string) => {
  await expect(page.getByTestId('archived-project').filter({ hasText: name }).first()).toBeVisible({
    timeout: 15_000,
  });
});

Then('a {string} control is present', async ({ page }, label: string) => {
  await expect(page.getByRole('button', { name: label })).toBeVisible({ timeout: 15_000 });
});
