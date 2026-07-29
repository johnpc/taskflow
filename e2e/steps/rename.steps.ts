import { createBdd } from 'playwright-bdd';

const { When } = createBdd();

When(
  'the user renames the card {string} to {string}',
  async ({ page }, from: string, to: string) => {
    await page
      .getByTestId('task-card')
      .filter({ hasText: from })
      .first()
      .getByTestId('card-rename')
      .click();
    // Once editing, the card's title is an input (no longer matches hasText:from),
    // so grab the sole open editor at the page level.
    const input = page.getByTestId('card-title-input');
    await input.fill(to);
    await input.press('Enter');
  },
);
