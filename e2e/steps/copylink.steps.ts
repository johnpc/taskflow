import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user copies the task link', async ({ page }) => {
  await page.getByTestId('task-copy-link').click();
});

Then('the copy-link button confirms {string}', async ({ page }, label: string) => {
  await expect(page.getByTestId('task-copy-link')).toHaveText(label, { timeout: 15_000 });
});
