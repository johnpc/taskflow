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
