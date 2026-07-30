import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user moves the task to the {string} section', async ({ page }, section: string) => {
  await page.getByTestId('task-section-select').selectOption({ label: section });
});

Then("the task's section is {string}", async ({ page }, section: string) => {
  // The select reflects the persisted move once the patch round-trips.
  await expect(page.getByTestId('task-section-select')).toHaveValue(/.+/, { timeout: 15_000 });
  const selected = page.getByTestId('task-section-select').locator('option:checked');
  await expect(selected).toHaveText(section, { timeout: 15_000 });
});

When('the user assigns the task to themselves', async ({ page }) => {
  // The assignee select lists the project's members; the seed user is the only
  // member, so its email is the second option (after "Unassigned").
  const select = page.getByTestId('task-assignee-select');
  const email = await select.locator('option').nth(1).getAttribute('value');
  await select.selectOption(email!);
});

Then('the task is shown as assigned', async ({ page }) => {
  await expect(page.getByTestId('task-assignee-select')).not.toHaveValue('', { timeout: 15_000 });
});
