import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Then } = createBdd();

Then('the comment {string} shows a timestamp', async ({ page }, body: string) => {
  const row = page.getByTestId('comment').filter({ hasText: body }).first();
  await expect(row.getByTestId('comment-time')).toBeVisible({ timeout: 15_000 });
});
