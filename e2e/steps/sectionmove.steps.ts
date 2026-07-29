import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user moves the {string} section left', async ({ page }, name: string) => {
  await page
    .getByTestId('board-column')
    .filter({ hasText: name })
    .first()
    .getByTestId('section-move-left')
    .click();
});

Then('the first board column is {string}', async ({ page }, name: string) => {
  await expect(page.getByTestId('board-column').first()).toContainText(name, { timeout: 15_000 });
});
