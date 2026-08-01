import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When } = createBdd();

const selectCard = async (page: import('@playwright/test').Page, title: string) => {
  await page
    .getByTestId('task-card')
    .filter({ hasText: title })
    .first()
    .getByTestId('task-select')
    .check();
};

When('the user selects the tasks {string} and {string}', async ({ page }, a: string, b: string) => {
  await selectCard(page, a);
  await selectCard(page, b);
});

When('the user bulk-completes the selection', async ({ page }) => {
  await expect(page.getByTestId('selection-bar')).toBeVisible({ timeout: 15_000 });
  await page.getByTestId('bulk-complete').click();
});

When('the user bulk-assigns the selection to a member', async ({ page }) => {
  await expect(page.getByTestId('selection-bar')).toBeVisible({ timeout: 15_000 });
  // Pick the first real member option (index 1; index 0 is the "Assign to…" placeholder).
  const select = page.getByTestId('bulk-assign');
  const value = await select.locator('option').nth(1).getAttribute('value');
  await select.selectOption(value!);
});
