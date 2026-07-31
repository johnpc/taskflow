import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user opens the quick-added task {string}', async ({ page }, title: string) => {
  // The task was just created live via quick-add (which invalidates My Tasks).
  // First give the invalidation-driven refetch a chance (no reload — a reload
  // would race the in-flight create); only reload if it hasn't shown, to absorb
  // any read-your-write lag on the shared backend.
  const row = page.getByTestId('task-card').filter({ hasText: title });
  await expect(async () => {
    if (!(await row.count())) {
      await page.waitForTimeout(2_000);
      if (!(await row.count())) await page.reload();
    }
    await expect(row.first()).toBeVisible({ timeout: 3_000 });
  }).toPass({ timeout: 60_000 });
  await row.first().getByTestId('task-open').click();
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
