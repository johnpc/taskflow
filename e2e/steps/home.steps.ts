import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Then } = createBdd();

Then('the home dashboard shows a greeting', async ({ page }) => {
  await expect(page.getByTestId('home-greeting')).toContainText('Good', { timeout: 15_000 });
});

Then('the home dashboard shows the overdue stat', async ({ page }) => {
  await expect(page.getByTestId('home-overdue')).toBeVisible({ timeout: 15_000 });
});

Then('a home project shortcut {string} is visible', async ({ page }, name: string) => {
  await expect(page.getByText(name, { exact: true }).first()).toBeVisible({ timeout: 15_000 });
});

Then('a home upcoming task {string} is visible', async ({ page }, title: string) => {
  await expect(
    page.getByTestId('home-upcoming-item').filter({ hasText: title }).first(),
  ).toBeVisible({ timeout: 15_000 });
});

Then('a home today task {string} is visible', async ({ page }, title: string) => {
  await expect(page.getByTestId('home-today-item').filter({ hasText: title }).first()).toBeVisible({
    timeout: 15_000,
  });
});
