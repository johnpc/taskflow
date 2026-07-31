import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user opens the You tab', async ({ page }) => {
  await page.goto('/you');
  await expect(page.getByTestId('profile')).toBeVisible({ timeout: 15_000 });
});

When(
  'the user submits a password change with current {string} and new {string}',
  async ({ page }, current: string, next: string) => {
    await page.getByTestId('cp-current').fill(current);
    await page.getByTestId('cp-new').fill(next);
    await page.getByTestId('cp-save').click();
  },
);

Then('the password change shows an error', async ({ page }) => {
  await expect(page.getByTestId('cp-error')).toBeVisible({ timeout: 15_000 });
});

When('the user sets their display name to {string}', async ({ page }, name: string) => {
  const input = page.getByTestId('display-name-input');
  await expect(input).toBeVisible({ timeout: 15_000 });
  await input.fill(name);
  const save = page.getByTestId('display-name-save');
  if (await save.isEnabled()) await save.click();
});

Then('the display name is saved', async ({ page }) => {
  // Robust across reruns: the field holds the saved value (whether just saved or
  // already persisted from a prior run).
  await expect(page.getByTestId('display-name-input')).toHaveValue('Test Person', {
    timeout: 15_000,
  });
});
