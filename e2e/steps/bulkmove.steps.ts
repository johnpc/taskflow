import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user bulk-moves the selection to {string}', async ({ page }, section: string) => {
  await page.getByTestId('bulk-move').selectOption({ label: section });
});

When('the user expands the {string} list section', async ({ page }, name: string) => {
  const toggle = page
    .getByTestId('list-section')
    .filter({ hasText: name })
    .first()
    .getByTestId('list-section-toggle');
  if ((await toggle.getAttribute('aria-expanded')) !== 'true') await toggle.click();
});

Then(
  'the {string} list section contains {string}',
  async ({ page }, section: string, title: string) => {
    const list = page.getByTestId('list-section').filter({ hasText: section }).first();
    await expect(list.getByTestId('task-card').filter({ hasText: title }).first()).toBeVisible({
      timeout: 15_000,
    });
  },
);
