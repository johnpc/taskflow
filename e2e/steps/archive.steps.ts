import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user archives the project', async ({ page }) => {
  await page.getByTestId('project-menu').click();
  await page.getByTestId('project-archive').click();
  await page.waitForURL('**/projects', { timeout: 20_000 });
});

When('the user deletes the project', async ({ page }) => {
  await page.getByTestId('project-menu').click();
  await page.getByTestId('project-delete').click();
  // The action sheet dismisses and the confirm alert opens; wait for it, then
  // confirm via the alert's own testid.
  const confirm = page.getByTestId('project-delete-confirm');
  await confirm.waitFor({ state: 'visible', timeout: 15_000 });
  await confirm.click();
  // Assert the route left the board rather than heading visibility — the alert
  // backdrop can briefly overlay the projects screen during dismissal.
  await page.waitForURL('**/projects', { timeout: 20_000 });
});

Then('a project named {string} is not listed', async ({ page }, name: string) => {
  await expect(page.getByTestId('project-card').filter({ hasText: name })).toHaveCount(0, {
    timeout: 15_000,
  });
});
