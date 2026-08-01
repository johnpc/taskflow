import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

// Ionic keeps prior /tasks/:id pages mounted when only the route param changes,
// so the discriminator between "on a subtask" vs "on the top-level parent" is
// the breadcrumb: a subtask page shows "‹ Parent", a top-level task shows none.
When('the user opens the subtask {string}', async ({ page }, title: string) => {
  const before = page.url();
  await page.getByTestId('subtask-open').filter({ hasText: title }).first().click();
  await page.waitForFunction((prev) => location.href !== prev, before, { timeout: 15_000 });
});

Then('the subtask {string} shows an overdue due chip', async ({ page }, title: string) => {
  const row = page.getByTestId('subtasks').locator('.subtask').filter({ hasText: title }).first();
  await expect(row.getByTestId('subtask-due')).toHaveClass(/subtask__due--overdue/, {
    timeout: 15_000,
  });
});

When(
  'the user sets the subtask {string} due date to {string}',
  async ({ page }, title: string, date: string) => {
    const row = page.getByTestId('subtasks').locator('.subtask').filter({ hasText: title }).first();
    await row.getByLabel('Set subtask due date').fill(date);
  },
);

Then('the subtask {string} due date is {string}', async ({ page }, title: string, date: string) => {
  const row = page.getByTestId('subtasks').locator('.subtask').filter({ hasText: title }).first();
  await expect(row.getByLabel('Set subtask due date')).toHaveValue(date, { timeout: 15_000 });
});

Then('the subtask {string} shows an assignee avatar', async ({ page }, title: string) => {
  const row = page.getByTestId('subtasks').locator('.subtask').filter({ hasText: title }).first();
  await expect(row.getByTestId('task-assignee-avatar')).toBeVisible({ timeout: 15_000 });
});

When('the user assigns the subtask {string} to themselves', async ({ page }, title: string) => {
  const row = page.getByTestId('subtasks').locator('.subtask').filter({ hasText: title }).first();
  // Pick the first real member option (index 1; index 0 is "Unassigned").
  const select = row.getByLabel('Assign subtask');
  const value = await select.locator('option').nth(1).getAttribute('value');
  await select.selectOption(value!);
});

Then('the parent breadcrumb reads {string}', async ({ page }, title: string) => {
  await expect(page.getByTestId('task-parent-crumb').last()).toContainText(title, {
    timeout: 15_000,
  });
});

When('the user opens the parent breadcrumb', async ({ page }) => {
  const before = page.url();
  await page.getByTestId('task-parent-crumb').last().click();
  await page.waitForFunction((prev) => location.href !== prev, before, { timeout: 15_000 });
});

Then('no parent breadcrumb is shown', async ({ page }) => {
  // The active (top-level) page has no breadcrumb. Poll until the crumb that
  // belonged to the subtask page is gone from the active view.
  await expect(async () => {
    const crumbs = page.getByTestId('task-parent-crumb');
    // Either none exist, or the only remaining one is on a now-hidden page.
    const visible = await crumbs.filter({ visible: true }).count();
    expect(visible).toBe(0);
  }).toPass({ timeout: 15_000 });
});
