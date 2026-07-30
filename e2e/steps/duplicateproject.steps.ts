import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user duplicates the project', async ({ page }) => {
  await page.getByTestId('project-menu').click();
  await page.getByText('Duplicate project').click();
});

Then('the user is on the project named {string}', async ({ page }, name: string) => {
  // Duplication navigates to the fresh copy. Ionic keeps the previous project
  // page mounted, so several project-title elements can coexist — filter to the
  // one whose text is the copy's name (only it contains "(copy)").
  await expect(page.getByTestId('project-title').filter({ hasText: name }).first()).toBeVisible({
    timeout: 20_000,
  });
});

Then('the duplicated board shows a task titled {string}', async ({ page }, title: string) => {
  // Scope to the ACTIVE ion-page — Ionic keeps the source project's (hidden)
  // board mounted, which also has this task; assert the visible copy's card.
  const active = page.locator('.ion-page:not(.ion-page-hidden)').last();
  await expect(active.getByTestId('task-card').filter({ hasText: title }).first()).toBeVisible({
    timeout: 20_000,
  });
});
