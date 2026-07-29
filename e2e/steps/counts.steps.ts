import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Then } = createBdd();

Then('the {string} project shows a task count', async ({ page }, name: string) => {
  await page.goto('/projects');
  await expect(
    page.getByTestId('project-card').filter({ hasText: name }).getByTestId('project-count'),
  ).toBeVisible({ timeout: 15_000 });
});

Then('an overdue count is shown', async ({ page }) => {
  await expect(page.getByTestId('mytasks-overdue')).toBeVisible({ timeout: 15_000 });
});
