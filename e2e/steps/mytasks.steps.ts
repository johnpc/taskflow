import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user opens My Tasks', async ({ page }) => {
  await page.goto('/my-tasks');
  await expect(page.getByRole('heading', { name: 'What’s on your plate' })).toBeVisible({
    timeout: 15_000,
  });
});

When('the user groups My Tasks by priority', async ({ page }) => {
  await page.getByTestId('groupby-priority').click();
});

When('the user groups My Tasks by project', async ({ page }) => {
  await page.getByTestId('groupby-project').click();
});

When('the user filters My Tasks to assigned-to-me', async ({ page }) => {
  await page.getByTestId('mytasks-assigned-only').check();
});

When('the user filters My Tasks to following', async ({ page }) => {
  await page.getByTestId('mytasks-following-only').check();
});

When('the user collapses the {string} bucket', async ({ page }, label: string) => {
  await page
    .getByTestId('mytasks-summary') // ensure the page is loaded
    .waitFor({ timeout: 15_000 });
  const head = page.getByTestId('bucket-toggle').filter({ hasText: label }).first();
  await head.click();
});

When('the user sorts My Tasks by {string}', async ({ page }, label: string) => {
  await page.getByTestId('mytasks-sort-key').selectOption({ label });
});

Then('the My Tasks sort direction toggle is visible', async ({ page }) => {
  await expect(page.getByTestId('mytasks-sort-dir')).toBeVisible({ timeout: 15_000 });
});

Then('a due bucket {string} is visible', async ({ page }, label: string) => {
  await expect(page.getByRole('heading', { name: new RegExp(label) })).toBeVisible({
    timeout: 15_000,
  });
});

Then('a task titled {string} is visible in My Tasks', async ({ page }, title: string) => {
  await expect(page.getByTestId('task-card').filter({ hasText: title }).first()).toBeVisible({
    timeout: 15_000,
  });
});

When(
  'the user quick-adds {string} to the {string} project',
  async ({ page }, title: string, project: string) => {
    // Idempotent for CI retries: skip if it's already here (sandbox persists it).
    if ((await page.getByTestId('task-card').filter({ hasText: title }).count()) > 0) return;
    await page.getByTestId('quickadd-title').fill(title);
    await page.getByTestId('quickadd-project').selectOption({ label: project });
    await page.getByTestId('quickadd-add').click();
  },
);
