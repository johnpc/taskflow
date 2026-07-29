import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Then } = createBdd();

Then('the notes preview shows a checklist item', async ({ page }) => {
  await expect(page.getByTestId('notes-check').first()).toBeVisible({ timeout: 15_000 });
});

Then('the notes preview shows a link to {string}', async ({ page }, href: string) => {
  await expect(page.getByTestId('notes-preview').locator(`a[href="${href}"]`)).toBeVisible({
    timeout: 15_000,
  });
});
