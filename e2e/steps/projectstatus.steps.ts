import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

const STATUS_ID: Record<string, string> = {
  'On track': 'ON_TRACK',
  'At risk': 'AT_RISK',
  'Off track': 'OFF_TRACK',
};

When('the user marks the project {string}', async ({ page }, label: string) => {
  await page.getByTestId(`status-set-${STATUS_ID[label]}`).click();
});

Then('the project shows the {string} status pill', async ({ page }, label: string) => {
  const header = page.getByTestId('project-header');
  await expect(header.getByTestId('status-pill')).toHaveText(label, { timeout: 15_000 });
});
