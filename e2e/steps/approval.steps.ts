import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user sets the approval to {string}', async ({ page }, value: string) => {
  await page.getByTestId('task-approval').selectOption(value);
});

Then('the task detail shows the approval {string}', async ({ page }, value: string) => {
  // The picker is the durable, deterministic proof the write round-tripped
  // (the read-only card badge lives on the board, not the detail).
  await expect(page.getByTestId('task-approval')).toHaveValue(value, { timeout: 15_000 });
});
