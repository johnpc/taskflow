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

When('the user sorts the list by {string}', async ({ page }, column: string) => {
  await page.getByTestId(`list-sort-${column}`).first().click();
});

When(
  'the user adds a task titled {string} from the list composer',
  async ({ page }, title: string) => {
    // Idempotent for CI retries: if a prior attempt already created it (the
    // sandbox persists), skip re-adding to avoid a duplicate row.
    if ((await page.getByTestId('task-card').filter({ hasText: title }).count()) > 0) return;
    await page.getByTestId('add-card').last().click();
    const input = page.getByTestId('add-card-input').last();
    await input.fill(title);
    await input.press('Enter');
  },
);

Then('the list is sorted by {string} {word}', async ({ page }, column: string, dir: string) => {
  const header = page.getByTestId(`list-sort-${column}`).first();
  await expect(header).toHaveAttribute('aria-pressed', 'true', { timeout: 15_000 });
  await expect(header).toContainText(dir === 'ascending' ? '▲' : '▼', { timeout: 15_000 });
});

Then(
  'the list row {string} shows the priority {string}',
  async ({ page }, title: string, priority: string) => {
    // Match by EXACT title (the open button) so a partial-title sibling can't be
    // picked by hasText.
    const row = page
      .getByTestId('task-card')
      .filter({ has: page.getByTestId('task-open').getByText(title, { exact: true }) })
      .first();
    // The Priority cell is a dropdown (quick-edit): assert its selected value's
    // label rather than the element's concatenated option text.
    await expect(row.getByTestId('row-priority')).toHaveValue(priority.toUpperCase(), {
      timeout: 15_000,
    });
  },
);
