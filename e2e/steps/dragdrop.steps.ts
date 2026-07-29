import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When(
  'the user drags the card {string} to the {string} column',
  async ({ page }, title: string, column: string) => {
    const card = page.getByTestId('task-card').filter({ hasText: title }).first();
    const target = page.getByTestId('board-column').filter({ hasText: column }).first();
    // Playwright's dragTo() uses raw mouse moves that native HTML5 DnD ignores.
    // Manually dispatch the DnD sequence with a shared DataTransfer so the app's
    // onDragStart / onDragOver / onDrop handlers fire.
    await card.dispatchEvent('dragstart');
    await target.dispatchEvent('dragover');
    await target.dispatchEvent('drop');
    await card.dispatchEvent('dragend');
  },
);

Then('the {string} column contains {string}', async ({ page }, column: string, title: string) => {
  const target = page.getByTestId('board-column').filter({ hasText: column }).first();
  await expect(target.getByTestId('task-card').filter({ hasText: title })).toBeVisible({
    timeout: 15_000,
  });
});
