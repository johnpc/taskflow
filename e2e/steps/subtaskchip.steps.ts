import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Then } = createBdd();

Then(
  'the board card {string} shows subtask progress {string}',
  async ({ page }, title: string, progress: string) => {
    const card = page.getByTestId('task-card').filter({ hasText: title }).first();
    await expect(card.getByTestId('task-subs')).toContainText(progress, { timeout: 15_000 });
  },
);

Then('a subtask-complete confirmation appears', async ({ page }) => {
  await expect(page.getByText("This task isn't ready")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText('incomplete subtask', { exact: false })).toBeVisible();
  // Cancel so "Chip parent" stays open — this scenario mutates nothing.
  await page.getByRole('button', { name: 'Cancel' }).click();
});
