import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

const STATUS_ID: Record<string, string> = {
  'On track': 'ON_TRACK',
  'At risk': 'AT_RISK',
  'Off track': 'OFF_TRACK',
};

When(
  'the user posts an {string} status update reading {string}',
  async ({ page }, label: string, note: string) => {
    await page.getByTestId(`status-post-${STATUS_ID[label]}`).click();
    await page.getByTestId('status-update-note').fill(note);
    await page.getByTestId('status-update-post').click();
  },
);

Then('a status update reading {string} is visible', async ({ page }, note: string) => {
  await expect(page.getByTestId('status-update').filter({ hasText: note }).first()).toBeVisible({
    timeout: 15_000,
  });
});
