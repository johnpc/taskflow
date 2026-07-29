import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user goes to the projects screen', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByTestId('project-card').first()).toBeVisible({ timeout: 15_000 });
});

Then(
  'the project {string} shows progress {string}',
  async ({ page }, name: string, label: string) => {
    const card = page.getByTestId('project-card').filter({ hasText: name }).first();
    await expect(card.getByTestId('project-progress-label')).toHaveText(label, { timeout: 15_000 });
  },
);
