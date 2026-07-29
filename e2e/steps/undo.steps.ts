import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When } = createBdd();

When('the user clicks undo on the toast', async ({ page }) => {
  await expect(page.getByTestId('undo-toast')).toBeVisible({ timeout: 15_000 });
  await page.getByTestId('undo-toast-action').click();
});
