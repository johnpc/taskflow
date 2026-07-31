import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('the user opens the You tab', async ({ page }) => {
  await page.goto('/you');
  await expect(page.getByTestId('profile')).toBeVisible({ timeout: 15_000 });
});

When(
  'the user submits a password change with current {string} and new {string}',
  async ({ page }, current: string, next: string) => {
    await page.getByTestId('cp-current').fill(current);
    await page.getByTestId('cp-new').fill(next);
    await page.getByTestId('cp-save').click();
  },
);

Then('the password change shows an error', async ({ page }) => {
  await expect(page.getByTestId('cp-error')).toBeVisible({ timeout: 15_000 });
});

When('the user sets their display name to {string}', async ({ page }, name: string) => {
  const input = page.getByTestId('display-name-input');
  await expect(input).toBeVisible({ timeout: 15_000 });
  // Force a change (clear → fill) so Save is always dirty/enabled — a click
  // always fires a real mutation, even on a rerun where the name is unchanged.
  await input.fill('');
  await input.fill(name);
  await page.getByTestId('display-name-save').click();
});

Then('the display name is saved', async ({ page }) => {
  // The "Saved" marker only shows on a CONFIRMED mutation success (isSuccess +
  // not dirty) — so this waits for the server write to actually land, not just
  // the local input value or the ambiguous mid-flight disabled state.
  await expect(page.getByTestId('display-name-ok')).toBeVisible({ timeout: 15_000 });
});

When('the user uploads an avatar image', async ({ page }) => {
  // A 1x1 PNG uploaded straight into the (hidden) file input.
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64',
  );
  await page.getByTestId('avatar-file').setInputFiles({
    name: 'avatar.png',
    mimeType: 'image/png',
    buffer: png,
  });
});

Then('the avatar image is shown', async ({ page }) => {
  await expect(page.getByTestId('avatar-image')).toBeVisible({ timeout: 20_000 });
});

Then('a member avatar for {string} is shown', async ({ page }, name: string) => {
  // The resolved name is the avatar element's own title attribute.
  await expect(
    page
      .getByTestId('member-avatar')
      .and(page.locator(`[title="${name}"]`))
      .first(),
  ).toBeVisible({ timeout: 15_000 });
});
