import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user marks the task done from its detail', async ({ page }) => {
  const check = page.getByTestId('task-detail-check');
  // Only complete if not already done (idempotent for CI retries — clicking a
  // done task would reopen it and log a different event).
  if ((await check.getAttribute('aria-label')) === 'Mark done') await check.click();
});

Then('the activity feed shows a {string} event', async ({ page }, verb: string) => {
  await expect(page.getByTestId('activity-item').filter({ hasText: verb }).first()).toBeVisible({
    timeout: 20_000,
  });
});
