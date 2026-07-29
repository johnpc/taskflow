import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

Then('the board card {string} shows a starts chip', async ({ page }, title: string) => {
  const card = page.getByTestId('task-card').filter({ hasText: title }).first();
  await expect(card.getByTestId('task-start')).toBeVisible({ timeout: 15_000 });
});

When('the user sets the start date to {string}', async ({ page }, date: string) => {
  await page.getByTestId('task-start-input').fill(date);
  await page.getByTestId('task-start-input').blur();
});

Then('the task start date is {string}', async ({ page }, date: string) => {
  await expect(page.getByTestId('task-start-input')).toHaveValue(date, { timeout: 15_000 });
});
