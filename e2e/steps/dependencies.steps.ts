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
