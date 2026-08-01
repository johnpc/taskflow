import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

/** YYYY-MM-DD for `n` days from today (UTC), matching TimelineView's window. */
function daysOut(n: number): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + n))
    .toISOString()
    .slice(0, 10);
}

When('the user switches to the timeline view', async ({ page }) => {
  await page.getByTestId('view-timeline').click();
  await expect(page.getByTestId('timeline-view')).toBeVisible({ timeout: 15_000 });
});

Then('a timeline bar for {string} is visible', async ({ page }, title: string) => {
  await expect(page.getByTestId('timeline-bar').filter({ hasText: title }).first()).toBeVisible({
    timeout: 15_000,
  });
});

Then("the timeline marks today's column", async ({ page }) => {
  await expect(page.getByTestId('timeline-today')).toHaveText('Today', { timeout: 15_000 });
});

Then(
  'the timeline bar for {string} is colored {word} priority',
  async ({ page }, title: string, level: string) => {
    const bar = page.getByTestId('timeline-bar').filter({ hasText: title }).first();
    await expect(bar).toHaveClass(new RegExp(`timeline__bar--${level}`), { timeout: 15_000 });
  },
);

When(
  'the user drags the {string} bar to {int} days out',
  async ({ page }, title: string, n: number) => {
    const bar = page.getByTestId('timeline-bar').filter({ hasText: title }).first();
    const day = page.getByTestId(`timeline-day-${daysOut(n)}`);
    await expect(bar).toBeVisible({ timeout: 15_000 });
    // Playwright's dragTo doesn't fire native HTML5 DnD; dispatch the events with
    // a shared DataTransfer so onDragStart→onDrop wire up.
    const dt = await page.evaluateHandle(() => new DataTransfer());
    await bar.dispatchEvent('dragstart', { dataTransfer: dt });
    await day.dispatchEvent('dragover', { dataTransfer: dt });
    await day.dispatchEvent('drop', { dataTransfer: dt });
    await bar.dispatchEvent('dragend', { dataTransfer: dt });
  },
);

Then('the task {string} is due {int} days out', async ({ page }, title: string, n: number) => {
  // The board query the reschedule mutation invalidates re-renders the bar at the
  // new day's column (grid-column is 1-based, so offset n → n+1). Asserting here
  // (not on task detail) reads from the same refetched query — no read-your-write
  // race against a separate detail fetch on the contended shared sandbox.
  const bar = page.getByTestId('timeline-bar').filter({ hasText: title }).first();
  await expect(bar).toHaveCSS('grid-column-start', String(n + 1), { timeout: 15_000 });
});
