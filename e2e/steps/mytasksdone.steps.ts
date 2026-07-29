import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user shows completed in My Tasks', async ({ page }) => {
  await page.getByTestId('mytasks-show-completed').check();
});

Then('the {string} bucket contains {string}', async ({ page }, label: string, title: string) => {
  const section = page.getByTestId('bucket-completed');
  await expect(section).toContainText(label, { timeout: 15_000 });
  await expect(section.getByTestId('task-card').filter({ hasText: title }).first()).toBeVisible({
    timeout: 15_000,
  });
});
