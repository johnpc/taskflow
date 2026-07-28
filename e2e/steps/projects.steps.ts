import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

Then('the projects screen shows the seeded projects', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Your projects' })).toBeVisible();
  // At least one real project card from the seed is rendered.
  await expect(page.getByTestId('project-card').first()).toBeVisible({ timeout: 15_000 });
});

Then('a project named {string} is visible', async ({ page }, name: string) => {
  await expect(page.getByText(name, { exact: true }).first()).toBeVisible({ timeout: 15_000 });
});

When('the user creates a project named {string}', async ({ page }, name: string) => {
  await page.getByTestId('new-project').click();
  const input = page.getByTestId('new-project-input');
  await input.fill(name);
  await input.press('Enter');
});

Given('the user opens the {string} project', async ({ page }, name: string) => {
  await page.getByTestId('project-card').filter({ hasText: name }).getByRole('link').click();
  await expect(page.getByTestId('board')).toBeVisible({ timeout: 15_000 });
});
