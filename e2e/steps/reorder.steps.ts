import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user moves the task {string} up', async ({ page }, title: string) => {
  await page
    .getByTestId('task-card')
    .filter({ hasText: title })
    .first()
    .getByTestId('reorder-up')
    .click();
});

Then(
  'the first task in the {string} column is {string}',
  async ({ page }, column: string, title: string) => {
    const col = page.getByTestId('board-column').filter({ hasText: column }).first();
    // Wait for the reorder to round-trip, then assert the first card's title.
    await expect(col.getByTestId('task-card').first()).toContainText(title, { timeout: 15_000 });
  },
);
