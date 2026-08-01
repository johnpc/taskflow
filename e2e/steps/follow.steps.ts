import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user follows the task', async ({ page }) => {
  await page.getByTestId('task-follow').click();
});

Then('the task shows as followed', async ({ page }) => {
  await expect(page.getByTestId('task-follow')).toHaveAttribute('aria-pressed', 'true', {
    timeout: 15_000,
  });
  await expect(page.getByTestId('task-follow')).toHaveText('Following', { timeout: 15_000 });
});

Then('the task shows as not followed', async ({ page }) => {
  await expect(page.getByTestId('task-follow')).toHaveAttribute('aria-pressed', 'false', {
    timeout: 15_000,
  });
  await expect(page.getByTestId('task-follow')).toHaveText('Follow', { timeout: 15_000 });
});
