import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user marks it blocked by {string}', async ({ page }, title: string) => {
  await page
    .getByTestId('blocker-picker')
    .getByTestId('blocker-option')
    .filter({ hasText: title })
    .first()
    .click();
});

Then('the blocked banner reads {string}', async ({ page }, text: string) => {
  await expect(page.getByTestId('blocked-banner')).toHaveText(text, { timeout: 15_000 });
});

Then('the board card {string} shows a Blocked badge', async ({ page }, title: string) => {
  const card = page.getByTestId('task-card').filter({ hasText: title }).first();
  await expect(card.getByTestId('task-blocked')).toBeVisible({ timeout: 15_000 });
});

When('the user tries to complete the task', async ({ page }) => {
  await expect(page.getByTestId('blocked-banner')).toBeVisible({ timeout: 15_000 });
  await page.getByTestId('task-detail-check').click();
});

Then('a blocked-complete confirmation appears', async ({ page }) => {
  await expect(page.getByText('This task is still blocked')).toBeVisible({ timeout: 15_000 });
  // Cancel so the task stays open — this scenario mutates nothing.
  await page.getByRole('button', { name: 'Cancel' }).click();
});
