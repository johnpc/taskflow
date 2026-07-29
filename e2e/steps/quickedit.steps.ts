import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user cycles the priority of {string}', async ({ page }, title: string) => {
  await page
    .getByTestId('task-card')
    .filter({ hasText: title })
    .first()
    .getByTestId('quick-edit-priority')
    .click();
});

Then('the task {string} shows a priority chip', async ({ page }, title: string) => {
  const card = page.getByTestId('task-card').filter({ hasText: title }).first();
  await expect(card.locator('[class*="task-card__prio"]').first()).toBeVisible({ timeout: 15_000 });
});
