import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When } = createBdd();

When('the user shows completed tasks', async ({ page }) => {
  const toggle = page.getByTestId('toggle-completed');
  await expect(toggle).toHaveText('Show completed', { timeout: 15_000 });
  await toggle.click();
});
