import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Then } = createBdd();

Then(
  'the board card {string} shows subtask progress {string}',
  async ({ page }, title: string, progress: string) => {
    const card = page.getByTestId('task-card').filter({ hasText: title }).first();
    await expect(card.getByTestId('task-subs')).toContainText(progress, { timeout: 15_000 });
  },
);
