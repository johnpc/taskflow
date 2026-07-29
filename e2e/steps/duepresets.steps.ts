import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user picks the {string} due preset', async ({ page }, key: string) => {
  await page.getByTestId(`due-preset-${key}`).click();
});

Then('the task has a due date set', async ({ page }) => {
  await expect(page.getByTestId('task-due-input')).toHaveValue(/^\d{4}-\d{2}-\d{2}$/, {
    timeout: 15_000,
  });
});
