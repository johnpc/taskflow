import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Then } = createBdd();

Then('an open task titled {string} is still on the board', async ({ page }, title: string) => {
  // The completed original hides (hide-completed default), so any visible card
  // with this title is the spawned next occurrence. setTaskDone awaits the
  // spawn before the toggle mutation's onSuccess invalidates the board query,
  // so the new card renders WITHOUT a reload — reloading here would re-restore
  // the Amplify session + re-fetch, piling load on the shared sandbox. Just
  // wait for an OPEN (not-done) card with this title to appear.
  const card = page.getByTestId('task-card').filter({ hasText: title }).first();
  await expect(card).toBeVisible({ timeout: 25_000 });
  await expect(card).not.toHaveClass(/task-card--done/, { timeout: 25_000 });
});

Then('the board card {string} shows a repeat badge', async ({ page }, title: string) => {
  const card = page.getByTestId('task-card').filter({ hasText: title }).first();
  await expect(card.getByTestId('task-repeat-badge')).toBeVisible({ timeout: 15_000 });
});
