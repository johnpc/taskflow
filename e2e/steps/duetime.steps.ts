import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user sets the due time to {string}', async ({ page }, time: string) => {
  await page.getByTestId('task-due-time').fill(time);
  await page.getByTestId('task-due-time').blur();
});

Then('the task due time is {string}', async ({ page }, time: string) => {
  await expect(page.getByTestId('task-due-time')).toHaveValue(time, { timeout: 15_000 });
});

Then('the {string} card due chip shows {string}', async ({ page }, title: string, text: string) => {
  const card = page.getByTestId('task-card').filter({ hasText: title }).first();
  await expect(card.getByTestId('task-due')).toContainText(text, { timeout: 15_000 });
});
