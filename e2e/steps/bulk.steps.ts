import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

const selectCard = async (page: import('@playwright/test').Page, title: string) => {
  await page
    .getByTestId('task-card')
    .filter({ hasText: title })
    .first()
    .getByTestId('task-select')
    .check();
};

When('the user selects the tasks {string} and {string}', async ({ page }, a: string, b: string) => {
  await selectCard(page, a);
  await selectCard(page, b);
});

When('the user bulk-completes the selection', async ({ page }) => {
  await expect(page.getByTestId('selection-bar')).toBeVisible({ timeout: 15_000 });
  await page.getByTestId('bulk-complete').click();
});

When('the user bulk-assigns the selection to a member', async ({ page }) => {
  await expect(page.getByTestId('selection-bar')).toBeVisible({ timeout: 15_000 });
  // Pick the first real member option (index 1; index 0 is the "Assign to…" placeholder).
  const select = page.getByTestId('bulk-assign');
  const value = await select.locator('option').nth(1).getAttribute('value');
  await select.selectOption(value!);
});

When(
  'the user bulk-sets the selection priority to {string}',
  async ({ page }, priority: string) => {
    await expect(page.getByTestId('selection-bar')).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('bulk-priority').selectOption(priority);
  },
);

When('the user bulk-adds the label {string} to the selection', async ({ page }, label: string) => {
  await expect(page.getByTestId('selection-bar')).toBeVisible({ timeout: 15_000 });
  await page.getByTestId('bulk-label').selectOption({ label });
});

When(
  'the user bulk-removes the label {string} from the selection',
  async ({ page }, label: string) => {
    await expect(page.getByTestId('selection-bar')).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('bulk-unlabel').selectOption({ label });
  },
);

Then(
  'the board card {string} shows the {string} priority',
  async ({ page }, title: string, label: string) => {
    const card = page.getByTestId('task-card').filter({ hasText: title }).first();
    await expect(card.locator('[class*="task-card__prio"]').first()).toHaveText(label, {
      timeout: 15_000,
    });
  },
);

Then(
  'the board card {string} shows the label {string}',
  async ({ page }, title: string, label: string) => {
    const card = page.getByTestId('task-card').filter({ hasText: title }).first();
    await expect(card.getByTestId('label-chip').filter({ hasText: label })).toBeVisible({
      timeout: 15_000,
    });
  },
);

Then(
  'the board card {string} does not show the label {string}',
  async ({ page }, title: string, label: string) => {
    const card = page.getByTestId('task-card').filter({ hasText: title }).first();
    await expect(card.getByTestId('label-chip').filter({ hasText: label })).toHaveCount(0, {
      timeout: 15_000,
    });
  },
);
