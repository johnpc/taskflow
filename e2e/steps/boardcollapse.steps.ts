import { createBdd } from 'playwright-bdd';

const { When } = createBdd();

When('the user collapses the {string} board column', async ({ page }, name: string) => {
  await page
    .getByTestId('board-column')
    .filter({ hasText: name })
    .first()
    .getByTestId('board-col-toggle')
    .click();
});
