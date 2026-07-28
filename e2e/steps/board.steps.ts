import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

/** A board task card located by its title text. */
const cardByTitle = (page: import('@playwright/test').Page, title: string) =>
  page.getByTestId('task-card').filter({ hasText: title });

Then('a board column named {string} is visible', async ({ page }, name: string) => {
  await expect(page.getByTestId('board-column').filter({ hasText: name }).first()).toBeVisible({
    timeout: 15_000,
  });
});

Then('a task titled {string} is visible on the board', async ({ page }, title: string) => {
  await expect(cardByTitle(page, title).first()).toBeVisible({ timeout: 15_000 });
});

When(
  'the user adds a task titled {string} to the {string} column',
  async ({ page }, title: string, column: string) => {
    const col = page.getByTestId('board-column').filter({ hasText: column }).first();
    await col.getByTestId('add-card').click();
    const input = col.getByTestId('add-card-input');
    await input.fill(title);
    await input.press('Enter');
  },
);

When('the user completes the task titled {string}', async ({ page }, title: string) => {
  await cardByTitle(page, title).first().getByTestId('task-check').click();
});

Then('the task titled {string} is shown as done', async ({ page }, title: string) => {
  // The card gains the done modifier once the completion round-trips + refetches.
  await expect(cardByTitle(page, title).first()).toHaveClass(/task-card--done/, {
    timeout: 15_000,
  });
});
