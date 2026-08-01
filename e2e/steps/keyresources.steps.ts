import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user opens the key-resources panel', async ({ page }) => {
  const toggle = page.getByTestId('key-resources-toggle');
  if ((await toggle.getAttribute('aria-expanded')) !== 'true') await toggle.click();
  await expect(page.getByTestId('key-resource-add')).toBeVisible({ timeout: 15_000 });
});

When(
  'the user adds the key resource {string} linking to {string}',
  async ({ page }, title: string, url: string) => {
    // Idempotent for CI retries: skip if the resource already persisted.
    if ((await page.getByTestId('key-resource').filter({ hasText: title }).count()) > 0) return;
    await page.getByTestId('key-resource-title').fill(title);
    await page.getByTestId('key-resource-url').fill(url);
    await page.getByTestId('key-resource-add').click();
  },
);

Then('the key resource {string} is listed', async ({ page }, title: string) => {
  await expect(page.getByTestId('key-resource').filter({ hasText: title })).toBeVisible({
    timeout: 15_000,
  });
});
