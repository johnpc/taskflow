import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user opens the task titled {string}', async ({ page }, title: string) => {
  await page
    .getByTestId('task-card')
    .filter({ hasText: title })
    .first()
    .getByTestId('task-open')
    .click();
  await expect(page.getByTestId('task-detail')).toBeVisible({ timeout: 15_000 });
});

Then('the task detail title is {string}', async ({ page }, title: string) => {
  await expect(page.getByTestId('task-title')).toHaveValue(title, { timeout: 15_000 });
});

When('the user adds a subtask titled {string}', async ({ page }, title: string) => {
  const subtasks = page.getByTestId('subtasks');
  await subtasks.getByTestId('add-card').click();
  const input = subtasks.getByTestId('add-card-input');
  await input.fill(title);
  await input.press('Enter');
});

Then('a subtask titled {string} is visible', async ({ page }, title: string) => {
  await expect(page.getByTestId('subtasks').getByText(title, { exact: true })).toBeVisible({
    timeout: 15_000,
  });
});

When('the user posts the comment {string}', async ({ page }, body: string) => {
  await page.getByTestId('comment-input').fill(body);
  await page.getByTestId('comment-post').click();
});

Then('a comment reading {string} is visible', async ({ page }, body: string) => {
  await expect(page.getByTestId('comment').filter({ hasText: body })).toBeVisible({
    timeout: 15_000,
  });
});
