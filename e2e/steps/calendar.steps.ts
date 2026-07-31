import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user opens the calendar', async ({ page }) => {
  await page.goto('/calendar');
  await expect(page.getByRole('heading', { name: 'The next two weeks' })).toBeVisible({
    timeout: 15_000,
  });
});

Then('a calendar task {string} is visible', async ({ page }, title: string) => {
  await expect(page.getByTestId('calendar-task').filter({ hasText: title }).first()).toBeVisible({
    timeout: 15_000,
  });
});

Then(
  'the calendar task {string} shows the project {string}',
  async ({ page }, title: string, project: string) => {
    const card = page.getByTestId('calendar-task').filter({ hasText: title }).first();
    await expect(card).toBeVisible({ timeout: 15_000 });
    await expect(card.getByTestId('calendar-project')).toHaveText(project, { timeout: 15_000 });
  },
);

Then('the calendar task {string} shows an assignee avatar', async ({ page }, title: string) => {
  const card = page.getByTestId('calendar-task').filter({ hasText: title }).first();
  await expect(card).toBeVisible({ timeout: 15_000 });
  await expect(card.getByTestId('task-assignee-avatar')).toBeVisible({ timeout: 15_000 });
});
