import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

Then('the board card {string} shows a milestone marker', async ({ page }, title: string) => {
  const card = page.getByTestId('task-card').filter({ hasText: title }).first();
  await expect(card.getByTestId('task-milestone')).toBeVisible({ timeout: 15_000 });
});

When('the user marks the task a milestone', async ({ page }) => {
  const toggle = page.getByTestId('task-milestone-toggle');
  if ((await toggle.getAttribute('aria-pressed')) !== 'true') await toggle.click();
});

Then('the task detail shows it is a milestone', async ({ page }) => {
  await expect(page.getByTestId('task-milestone-toggle')).toHaveAttribute('aria-pressed', 'true', {
    timeout: 15_000,
  });
});
