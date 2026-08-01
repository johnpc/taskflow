import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user opens the calendar', async ({ page }) => {
  await page.goto('/calendar');
  await expect(page.getByRole('heading', { name: 'Two weeks' })).toBeVisible({ timeout: 15_000 });
});

When('the user pages the calendar to the next week', async ({ page }) => {
  await page.getByTestId('calendar-next').click();
});

When('the user returns the calendar to today', async ({ page }) => {
  await page.getByTestId('calendar-today').click();
});

When('the user switches to the month calendar view', async ({ page }) => {
  await page.getByTestId('calendar-view-month').click();
});

Then('the calendar month grid is visible', async ({ page }) => {
  await expect(page.getByTestId('calendar-grid')).toBeVisible({ timeout: 15_000 });
});

Then('a calendar task {string} is visible', async ({ page }, title: string) => {
  await expect(page.getByTestId('calendar-task').filter({ hasText: title }).first()).toBeVisible({
    timeout: 15_000,
  });
});

Then('a calendar task {string} is not visible', async ({ page }, title: string) => {
  await expect(page.getByTestId('calendar-task').filter({ hasText: title })).toHaveCount(0, {
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
