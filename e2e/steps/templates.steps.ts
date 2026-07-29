import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When } = createBdd();

When('the user creates a project from the {string} template', async ({ page }, key: string) => {
  // The template picker lives on the Projects screen (sign-in lands on Home).
  await page.goto('/projects');
  await page.getByTestId(`template-${key}`).click();
  // Lands on the freshly created project board.
  await expect(page.getByTestId('board')).toBeVisible({ timeout: 20_000 });
});
