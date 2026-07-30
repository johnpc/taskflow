import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user switches to the timeline view', async ({ page }) => {
  await page.getByTestId('view-timeline').click();
  await expect(page.getByTestId('timeline-view')).toBeVisible({ timeout: 15_000 });
});

Then('a timeline bar for {string} is visible', async ({ page }, title: string) => {
  await expect(page.getByTestId('timeline-bar').filter({ hasText: title }).first()).toBeVisible({
    timeout: 15_000,
  });
});
