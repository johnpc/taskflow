import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Then } = createBdd();

Then('the task shows a created time', async ({ page }) => {
  await expect(page.getByTestId('activity-created')).toContainText('Created', { timeout: 15_000 });
});
