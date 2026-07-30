import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Then } = createBdd();

Then('a confetti celebration appears', async ({ page }) => {
  // The burst is a one-shot overlay that auto-clears after ~2.2s, so assert it
  // becomes visible (not that it lingers).
  await expect(page.getByTestId('confetti')).toBeVisible({ timeout: 15_000 });
});
