import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

/** The value control (text input OR select) of the field row labelled `name`. */
const fieldInput = (page: import('@playwright/test').Page, name: string) =>
  page.getByTestId('custom-field').filter({ hasText: name }).locator('input, select');

/** Idempotent guard: has a field with this label already been added? (A CI retry
 * re-runs against a sandbox where the field persists until the next reseed.) */
const fieldExists = (page: import('@playwright/test').Page, name: string) =>
  page.getByTestId('custom-field').filter({ hasText: name }).count();

When('the user adds the custom field {string}', async ({ page }, name: string) => {
  if ((await fieldExists(page, name)) > 0) return;
  const input = page.getByTestId('custom-field-name');
  await input.fill(name);
  await input.press('Enter');
});

When(
  'the user adds the select field {string} with options {string}',
  async ({ page }, name: string, options: string) => {
    if ((await fieldExists(page, name)) > 0) return;
    await page.getByTestId('custom-field-name').fill(name);
    await page.getByTestId('custom-field-type').selectOption('SELECT');
    await page.getByTestId('custom-field-options').fill(options);
    await page.getByTestId('custom-field-add').click();
  },
);

Then('the custom field {string} is shown on the task', async ({ page }, name: string) => {
  await expect(page.getByTestId('custom-field').filter({ hasText: name })).toBeVisible({
    timeout: 15_000,
  });
});

When(
  'the user sets the custom field {string} to {string}',
  async ({ page }, name: string, value: string) => {
    const control = fieldInput(page, name);
    const tag = await control.evaluate((el) => el.tagName);
    if (tag === 'SELECT')
      await control.selectOption(value); // commits on change
    else {
      await control.fill(value);
      await control.blur();
    }
    // The write is an async patch; let it round-trip before the later reload
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
