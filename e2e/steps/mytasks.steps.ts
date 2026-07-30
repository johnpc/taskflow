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

When('the user filters My Tasks to assigned-to-me', async ({ page }) => {
  await page.getByTestId('mytasks-assigned-only').check();
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
