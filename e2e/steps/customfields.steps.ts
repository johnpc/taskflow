import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

/** The text input of the custom-field row whose label is `name`. */
const fieldInput = (page: import('@playwright/test').Page, name: string) =>
  page.getByTestId('custom-field').filter({ hasText: name }).locator('input');

When('the user adds the custom field {string}', async ({ page }, name: string) => {
  // Idempotent: a CI retry re-runs against a sandbox where the field may already
  // exist (field creation persists until the next reseed) — only add if absent,
  // so the retry doesn't create a duplicate row (strict-mode violation).
  const existing = page.getByTestId('custom-field').filter({ hasText: name });
  if ((await existing.count()) > 0) return;
  const input = page.getByTestId('custom-field-name');
  await input.fill(name);
  await input.press('Enter');
});

Then('the custom field {string} is shown on the task', async ({ page }, name: string) => {
  await expect(page.getByTestId('custom-field').filter({ hasText: name })).toBeVisible({
    timeout: 15_000,
  });
});

When(
  'the user sets the custom field {string} to {string}',
  async ({ page }, name: string, value: string) => {
    const input = fieldInput(page, name);
    await input.fill(value);
    await input.blur();
    // Blur fires an async patch; let it round-trip before the later reload
    // re-fetches, so the reload can't read the pre-write task (read-your-write).
    await page.waitForLoadState('networkidle');
  },
);

When('the user reloads the task', async ({ page }) => {
  // A full reload = fresh mount (no stale Ionic page → no strict-mode dupes) and
  // a re-fetch, so the asserted value proves it persisted server-side.
  await page.reload();
  await expect(page.getByTestId('task-detail')).toBeVisible({ timeout: 15_000 });
});

Then(
  'the custom field {string} has the value {string}',
  async ({ page }, name: string, value: string) => {
    await expect(fieldInput(page, name)).toHaveValue(value, { timeout: 15_000 });
  },
);
