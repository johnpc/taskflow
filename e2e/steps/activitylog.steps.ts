import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user opens the activity task {string}', async ({ page }, title: string) => {
  // Resilient open for a freshly-seeded project whose board GSI read can lag
  // under peak CI load: wait for the board, and reload once if the card hasn't
  // appeared, before clicking it open.
  const card = page.getByTestId('task-card').filter({ hasText: title });
  await expect(page.getByTestId('board')).toBeVisible({ timeout: 20_000 });
  if ((await card.count()) === 0) {
    await page.reload();
    await expect(page.getByTestId('board')).toBeVisible({ timeout: 20_000 });
  }
  await card.first().getByTestId('task-open').click({ timeout: 20_000 });
  await expect(page.getByTestId('task-detail')).toBeVisible({ timeout: 20_000 });
});

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
