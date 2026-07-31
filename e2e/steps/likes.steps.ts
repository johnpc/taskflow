import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user likes the task', async ({ page }) => {
  await page.getByTestId('task-like').click();
});

Then('the task shows {int} like', async ({ page }, count: number) => {
  await expect(page.getByTestId('task-like')).toHaveAttribute('aria-pressed', 'true', {
    timeout: 15_000,
  });
  await expect(page.getByTestId('task-like-count')).toHaveText(String(count), { timeout: 15_000 });
});

Then('the task shows no likes', async ({ page }) => {
  await expect(page.getByTestId('task-like')).toHaveAttribute('aria-pressed', 'false', {
    timeout: 15_000,
  });
  await expect(page.getByTestId('task-like-count')).toHaveCount(0, { timeout: 15_000 });
});
