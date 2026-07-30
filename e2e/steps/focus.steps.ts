import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

const bucketValue: Record<string, string> = {
  Today: 'TODAY',
  Upcoming: 'UPCOMING',
  Later: 'LATER',
  Unsorted: 'NONE',
};

When('the user groups My Tasks by focus', async ({ page }) => {
  await page.getByTestId('groupby-focus').click();
});

When('the user files {string} into {string}', async ({ page }, title: string, bucket: string) => {
  const row = page.getByTestId('task-card').filter({ hasText: title }).first().locator('..');
  await row.getByTestId('focus-bucket-select').selectOption(bucketValue[bucket]);
});

When(
  'the user drags {string} into the {string} bucket',
  async ({ page }, title: string, bucket: string) => {
    // The draggable is the row <li> wrapping the card; the drop target is the
    // bucket section. Dispatch HTML5 DnD with a SHARED DataTransfer (Playwright's
    // dragTo doesn't fire native DnD, and the app reads the task id off it).
    const row = page.getByTestId('task-card').filter({ hasText: title }).first().locator('..');
    const target = page.getByTestId(`bucket-${bucketValue[bucket]}`);
    const dt = await page.evaluateHandle(() => new DataTransfer());
    await row.dispatchEvent('dragstart', { dataTransfer: dt });
    await target.dispatchEvent('dragover', { dataTransfer: dt });
    await target.dispatchEvent('drop', { dataTransfer: dt });
    await row.dispatchEvent('dragend', { dataTransfer: dt });
  },
);

Then(
  'the {string} focus bucket contains {string}',
  async ({ page }, bucket: string, title: string) => {
    const key = bucketValue[bucket];
    const section = page.getByTestId(`bucket-${key}`);
    await expect(section.getByTestId('task-card').filter({ hasText: title }).first()).toBeVisible({
      timeout: 15_000,
    });
  },
);
