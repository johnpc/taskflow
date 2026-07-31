import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When(
  'the user attaches the link {string} titled {string}',
  async ({ page }, url: string, title: string) => {
    const section = page.getByTestId('attachments');
    await section.getByTestId('attachment-title').fill(title);
    await section.getByTestId('attachment-url').fill(url);
    await section.getByTestId('attachment-add').click();
  },
);

Then(
  'a task attachment titled {string} links to {string}',
  async ({ page }, title: string, url: string) => {
    const link = page.getByTestId('attachments').getByRole('link', { name: title });
    await expect(link).toBeVisible({ timeout: 15_000 });
    await expect(link).toHaveAttribute('href', url);
  },
);

When('the user uploads a file attachment', async ({ page }) => {
  // Idempotent for CI retries: skip if this task already has the file row.
  if ((await page.getByTestId('attachment').filter({ hasText: 'note.txt' }).count()) > 0) return;
  await page.getByTestId('attachment-file').setInputFiles({
    name: 'note.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('hello from taskflow'),
  });
});

Then('a task attachment titled {string} is shown', async ({ page }, title: string) => {
  await expect(page.getByTestId('attachment').filter({ hasText: title }).first()).toBeVisible({
    timeout: 20_000,
  });
});
