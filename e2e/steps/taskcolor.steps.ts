import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user sets the highlight color to {string}', async ({ page }, color: string) => {
  await page.getByTestId(`task-color-${color}`).click();
  // Give the patch a beat to round-trip before navigating away (the detail
  // refetch re-renders the swatch as pressed, but we don't gate on that here).
  await page.waitForTimeout(1000);
});

Then('the board card {string} is color-accented', async ({ page }, title: string) => {
  const card = page.getByTestId('task-card').filter({ hasText: title }).first();
  await expect(card).toHaveAttribute('data-colored', 'true', { timeout: 15_000 });
});
