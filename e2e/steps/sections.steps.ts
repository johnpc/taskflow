import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user adds a section named {string}', async ({ page }, name: string) => {
  const input = page.getByTestId('add-section-input');
  await input.fill(name);
  await input.press('Enter');
});

When('the user sets the project description to {string}', async ({ page }, text: string) => {
  const input = page.getByTestId('project-description');
  await input.fill(text);
  await input.blur();
  // Give the update mutation time to round-trip before we navigate away.
  await page.waitForTimeout(1500);
});

When('the user reopens the {string} project', async ({ page }, name: string) => {
  await page.goto('/projects');
  await page.getByTestId('project-card').filter({ hasText: name }).getByRole('link').click();
  await expect(page.getByTestId('project-header')).toBeVisible({ timeout: 15_000 });
});

Then('the project description is {string}', async ({ page }, text: string) => {
  await expect(page.getByTestId('project-description')).toHaveValue(text, { timeout: 15_000 });
});
