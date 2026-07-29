import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user opens the calendar', async ({ page }) => {
  await page.goto('/calendar');
  await expect(page.getByRole('heading', { name: 'The next two weeks' })).toBeVisible({
    timeout: 15_000,
  });
});

Then('a calendar task {string} is visible', async ({ page }, title: string) => {
  await expect(page.getByTestId('calendar-task').filter({ hasText: title }).first()).toBeVisible({
    timeout: 15_000,
  });
});
