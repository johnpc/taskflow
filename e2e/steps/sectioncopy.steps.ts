import { createBdd } from 'playwright-bdd';

const { When } = createBdd();

When('the user duplicates the {string} section', async ({ page }, name: string) => {
  // Idempotent for CI retries: if a copy already exists (the sandbox persists it
  // until the next reseed), don't create another.
  if (
    (await page
      .getByTestId('board-column')
      .filter({ hasText: `${name} (copy)` })
      .count()) > 0
  ) {
    return;
  }
  const column = page.getByTestId('board-column').filter({ hasText: name }).first();
  await column.getByTestId('section-duplicate').click();
});
