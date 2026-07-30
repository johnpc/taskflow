import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user switches to the list view', async ({ page }) => {
  await page.getByTestId('view-list').click();
  await expect(page.getByTestId('list-view')).toBeVisible({ timeout: 15_000 });
});

Then('a list section named {string} is visible', async ({ page }, name: string) => {
  await expect(page.getByTestId('list-section').filter({ hasText: name }).first()).toBeVisible({
    timeout: 15_000,
  });
});

When('the user collapses the {string} list section', async ({ page }, name: string) => {
  await page
    .getByTestId('list-section')
    .filter({ hasText: name })
    .first()
    .getByTestId('list-section-toggle')
    .click();
});

Then('a task titled {string} is not visible', async ({ page }, title: string) => {
  await expect(page.getByTestId('task-card').filter({ hasText: title })).toHaveCount(0, {
    timeout: 15_000,
  });
});

Then('the list shows a column header row', async ({ page }) => {
  await expect(page.getByTestId('list-head-row').first()).toBeVisible({ timeout: 15_000 });
});

When('the user groups the list by {string}', async ({ page }, groupBy: string) => {
  await page.getByTestId('list-group-by-select').selectOption(groupBy);
});

Then(
  'the list row {string} shows the priority {string}',
  async ({ page }, title: string, priority: string) => {
    const row = page.getByTestId('task-card').filter({ hasText: title }).first();
    await expect(row.getByTestId('row-priority')).toHaveText(priority, { timeout: 15_000 });
  },
);
