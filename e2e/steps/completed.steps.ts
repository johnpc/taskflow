import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user opens the completed view', async ({ page }) => {
  await page.getByTestId('completed-link').click();
  await expect(page.getByTestId('completed-task').first()).toBeVisible({ timeout: 15_000 });
});

Then('a completed task {string} is visible', async ({ page }, title: string) => {
  await expect(page.getByTestId('completed-task').filter({ hasText: title }).first()).toBeVisible({
    timeout: 15_000,
  });
});
