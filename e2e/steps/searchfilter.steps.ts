import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

const prioTestId: Record<string, string> = {
  Any: 'search-prio-any',
  High: 'search-prio-high',
  Medium: 'search-prio-medium',
  Low: 'search-prio-low',
};

When('the user filters search to {string} priority', async ({ page }, priority: string) => {
  await page.getByTestId(prioTestId[priority]).click();
});

Then('a search result {string} is shown', async ({ page }, title: string) => {
  await expect(page.getByTestId('search-hit').filter({ hasText: title }).first()).toBeVisible({
    timeout: 15_000,
  });
});

Then('no search result {string} is shown', async ({ page }, title: string) => {
  await expect(page.getByTestId('search-hit').filter({ hasText: title })).toHaveCount(0, {
    timeout: 15_000,
  });
});
