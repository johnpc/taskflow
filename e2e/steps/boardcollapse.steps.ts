import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When } = createBdd();

When('the user collapses the {string} board column', async ({ page }, name: string) => {
  await page
    .getByTestId('board-column')
    .filter({ hasText: name })
    .first()
    .getByTestId('board-col-toggle')
    .click();
});

When('the user collapses all sections', async ({ page }) => {
  const btn = page.getByTestId('collapse-all');
  await expect(btn).toHaveText(/Collapse all/);
  await btn.click();
});

When('the user expands all sections', async ({ page }) => {
  const btn = page.getByTestId('collapse-all');
  await expect(btn).toHaveText(/Expand all/);
  await btn.click();
});
