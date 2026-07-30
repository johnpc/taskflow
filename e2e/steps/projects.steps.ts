import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

Then('the projects screen shows the seeded projects', async ({ page }) => {
  // Sign-in lands on Home; the Projects tab is where the cards live.
  await page.goto('/projects');
  await expect(page.getByRole('heading', { name: 'Your projects' })).toBeVisible();
  await expect(page.getByTestId('project-card').first()).toBeVisible({ timeout: 15_000 });
});

Then('a project named {string} is visible', async ({ page }, name: string) => {
  await expect(page.getByText(name, { exact: true }).first()).toBeVisible({ timeout: 15_000 });
});

When('the user creates a project named {string}', async ({ page }, name: string) => {
  await page.goto('/projects');
  await page.getByTestId('new-project').click();
  const input = page.getByTestId('new-project-input');
  await input.fill(name);
  await input.press('Enter');
});

Given('the user opens the {string} project', async ({ page }, name: string) => {
  // Reach the project list first (the signed-in landing is Home), then open it.
  await page.goto('/projects');
  // Match the card by EXACT name so a "<name> (copy)" (from a duplicate) can't
  // also match the substring and make the locator ambiguous.
  const card = page
    .getByTestId('project-card')
    .filter({ has: page.getByTestId('project-name').getByText(name, { exact: true }) });
  await card.getByRole('link').first().click();
  await expect(page.getByTestId('board')).toBeVisible({ timeout: 15_000 });
});

When('the user favorites the project from the header', async ({ page }) => {
  // Idempotent for CI retries: only click when not already favorited, since the
  // control toggles (a second click would unfavorite it).
  const star = page.getByTestId('project-favorite');
  if ((await star.getAttribute('aria-label')) === 'Favorite project') await star.click();
});

Then('the project header shows it as favorited', async ({ page }) => {
  await expect(page.getByTestId('project-favorite')).toHaveAttribute(
    'aria-label',
    'Unfavorite project',
    { timeout: 15_000 },
  );
});
