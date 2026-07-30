import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

const memberRow = (page: import('@playwright/test').Page, email: string) =>
  page.getByTestId('member-row').filter({ hasText: email });

When('the user invites {string} to the project', async ({ page }, email: string) => {
  await page.getByTestId('member-email').fill(email);
  await page.getByTestId('member-invite').click();
});

When('the user removes {string} from the project', async ({ page }, email: string) => {
  await memberRow(page, email).getByTestId('member-remove').click();
});

Then('the project is shared with {string}', async ({ page }, email: string) => {
  await expect(memberRow(page, email)).toBeVisible({ timeout: 15_000 });
});

Then('the project is not shared with {string}', async ({ page }, email: string) => {
  await expect(memberRow(page, email)).toHaveCount(0, { timeout: 15_000 });
});

Then('the project header shows {int} member avatars', async ({ page }, n: number) => {
  await expect(page.getByTestId('member-avatar')).toHaveCount(n, { timeout: 15_000 });
});
