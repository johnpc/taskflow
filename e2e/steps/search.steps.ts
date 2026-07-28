import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user searches for {string}', async ({ page }, query: string) => {
  await page.goto('/search');
  // IonSearchbar renders a native input inside the web component.
  await page.getByTestId('search-input').locator('input').fill(query);
});

Then('a search result reading {string} is visible', async ({ page }, text: string) => {
  await expect(page.getByTestId('search-hit').filter({ hasText: text }).first()).toBeVisible({
    timeout: 15_000,
  });
});

Then('the search empty state is shown', async ({ page }) => {
  await expect(page.getByTestId('search-empty')).toBeVisible({ timeout: 15_000 });
});
