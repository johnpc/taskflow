import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

Then(
  'the board card {string} shows subtask progress {string}',
  async ({ page }, title: string, progress: string) => {
    const card = page.getByTestId('task-card').filter({ hasText: title }).first();
    await expect(card.getByTestId('task-subs')).toContainText(progress, { timeout: 15_000 });
  },
);

When('the user tries to complete the task with open subtasks', async ({ page }) => {
  // Wait for the subtasks count to render first: it proves the subtask list has
  // loaded, so completeWarning sees the open subtasks. Clicking before that
  // races the load — the warning would be null and the task would just complete
  // (no confirm), mutating the shared "Chip parent" anchor. Deterministic guard.
  await expect(page.getByTestId('subtasks-count')).toBeVisible({ timeout: 15_000 });
  await page.getByTestId('task-detail-check').click();
});

Then('a subtask-complete confirmation appears', async ({ page }) => {
  await expect(page.getByText("This task isn't ready")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText('incomplete subtask', { exact: false })).toBeVisible();
  // Cancel so "Chip parent" stays open — this scenario mutates nothing.
  await page.getByRole('button', { name: 'Cancel' }).click();
});
