import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user opens the activity task {string}', async ({ page }, title: string) => {
  // The board's task read is a single GSI query; a just-seeded task can lag
  // eventual consistency under peak CI load, leaving the column empty. The board
  // only re-reads on reload, so reload until the card appears (bounded), then
  // open it. (Locator polling alone can't re-trigger the react-query read.)
  const card = page.getByTestId('task-card').filter({ hasText: title });
  await expect(async () => {
    if ((await card.count()) === 0) {
      await page.reload();
      await expect(page.getByTestId('board')).toBeVisible({ timeout: 15_000 });
    }
    await expect(card.first()).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: 40_000 });
  await card.first().getByTestId('task-open').click();
  await expect(page.getByTestId('task-detail')).toBeVisible({ timeout: 15_000 });
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
