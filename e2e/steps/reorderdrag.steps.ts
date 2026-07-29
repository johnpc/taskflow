import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When(
  'the user drops the card {string} onto the card {string}',
  async ({ page }, dragged: string, target: string) => {
    const from = page.getByTestId('task-card').filter({ hasText: dragged }).first();
    const onto = page.getByTestId('task-card').filter({ hasText: target }).first();
    // Native HTML5 DnD ignores Playwright's mouse-move dragTo; dispatch the
    // sequence so the app's onDragStart / onDragOver / onDrop fire on the card.
    await from.dispatchEvent('dragstart');
    await onto.dispatchEvent('dragover');
    await onto.dispatchEvent('drop');
    await from.dispatchEvent('dragend');
  },
);

Then(
  'the first card in the {string} column is {string}',
  async ({ page }, column: string, title: string) => {
    const col = page.getByTestId('board-column').filter({ hasText: column }).first();
    await expect(col.getByTestId('task-card').first()).toContainText(title, { timeout: 15_000 });
  },
);
