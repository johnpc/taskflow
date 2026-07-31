import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user likes the comment {string}', async ({ page }, body: string) => {
  await page
    .getByTestId('comment')
    .filter({ hasText: body })
    .first()
    .getByTestId('comment-like')
    .click();
});

Then('the comment {string} shows {int} like', async ({ page }, body: string, count: number) => {
  const row = page.getByTestId('comment').filter({ hasText: body }).first();
  await expect(row.getByTestId('comment-like')).toHaveAttribute('aria-pressed', 'true', {
    timeout: 15_000,
  });
  await expect(row.getByTestId('comment-like-count')).toHaveText(String(count), {
    timeout: 15_000,
  });
});

Then('the comment {string} shows no likes', async ({ page }, body: string) => {
  const row = page.getByTestId('comment').filter({ hasText: body }).first();
  await expect(row.getByTestId('comment-like')).toHaveAttribute('aria-pressed', 'false', {
    timeout: 15_000,
  });
  await expect(row.getByTestId('comment-like-count')).toHaveCount(0, { timeout: 15_000 });
});
