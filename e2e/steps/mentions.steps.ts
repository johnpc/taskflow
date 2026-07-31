import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Then } = createBdd();

Then('the comment mention {string} is highlighted', async ({ page }, mention: string) => {
  await expect(
    page.getByTestId('comment-mention').filter({ hasText: mention }).first(),
  ).toBeVisible({ timeout: 15_000 });
});

Then('the comment bold text {string} is emphasized', async ({ page }, text: string) => {
  await expect(page.locator('.comment__body strong').filter({ hasText: text }).first()).toBeVisible(
    {
      timeout: 15_000,
    },
  );
});
