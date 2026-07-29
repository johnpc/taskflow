import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When } = createBdd();

When(
  'the user edits the comment {string} to {string}',
  async ({ page }, from: string, to: string) => {
    // Enter edit mode on the matching row, then operate at page level: once the
    // body becomes a textarea the row's hasText filter no longer matches, and
    // only one comment can be in edit mode at a time.
    await page
      .getByTestId('comment')
      .filter({ hasText: from })
      .first()
      .getByTestId('comment-edit')
      .click();
    const input = page.getByTestId('comment-edit-input');
    await input.fill(to);
    await page.getByTestId('comment-edit-save').click();
    await expect(input).toHaveCount(0, { timeout: 15_000 });
  },
);
