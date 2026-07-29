import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Then } = createBdd();

Then('an open task titled {string} is still on the board', async ({ page }, title: string) => {
  // The completed original hides (hide-completed default), so any visible card
  // with this title is the spawned next occurrence. Poll (reload) until the
  // async spawn + board refetch round-trips.
  await expect(async () => {
    await page.reload();
    const card = page.getByTestId('task-card').filter({ hasText: title }).first();
    await expect(card).toBeVisible({ timeout: 5_000 });
    await expect(card).not.toHaveClass(/task-card--done/);
  }).toPass({ timeout: 25_000 });
});

Then('the board card {string} shows a repeat badge', async ({ page }, title: string) => {
  const card = page.getByTestId('task-card').filter({ hasText: title }).first();
  await expect(card.getByTestId('task-repeat-badge')).toBeVisible({ timeout: 15_000 });
});
