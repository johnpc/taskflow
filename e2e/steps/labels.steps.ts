import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

Then('a label chip {string} is visible on the board', async ({ page }, name: string) => {
  await expect(page.getByTestId('label-chip').filter({ hasText: name }).first()).toBeVisible({
    timeout: 15_000,
  });
});

When('the user applies the {string} label', async ({ page }, name: string) => {
  await page.getByTestId('label-option').filter({ hasText: name }).first().click();
});

Then('the {string} label is shown as applied', async ({ page }, name: string) => {
  await expect(page.getByTestId('label-option').filter({ hasText: name }).first()).toHaveAttribute(
    'aria-pressed',
    'true',
    { timeout: 15_000 },
  );
});
