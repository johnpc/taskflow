import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user deletes the comment {string}', async ({ page }, body: string) => {
  await page
    .getByTestId('comment')
    .filter({ hasText: body })
    .first()
    .getByTestId('comment-delete')
    .click();
});

Then('a comment reading {string} is not visible', async ({ page }, body: string) => {
  await expect(page.getByTestId('comment').filter({ hasText: body })).toHaveCount(0, {
    timeout: 15_000,
  });
});
