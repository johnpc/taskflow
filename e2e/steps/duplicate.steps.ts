import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When } = createBdd();

When('the user duplicates the task', async ({ page }) => {
  const before = page.url();
  await page.getByTestId('task-duplicate').click();
  // Duplication navigates to the NEW task's detail (a distinct /tasks/<id>);
  // waiting for that URL change proves the copy round-tripped.
  await page.waitForFunction((prev) => location.href !== prev, before, { timeout: 15_000 });
  await expect(page.getByTestId('task-detail')).toBeVisible({ timeout: 15_000 });
});
