import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user uploads a task cover image', async ({ page }) => {
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64',
  );
  await page.getByTestId('cover-file').setInputFiles({
    name: 'cover.png',
    mimeType: 'image/png',
    buffer: png,
  });
});

Then('the task cover preview is shown', async ({ page }) => {
  await expect(page.getByTestId('cover-preview')).toBeVisible({ timeout: 20_000 });
});
