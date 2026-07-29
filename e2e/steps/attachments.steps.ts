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
