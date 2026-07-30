import { createBdd } from 'playwright-bdd';

const { When } = createBdd();

When('the user saves the current view as {string}', async ({ page }, name: string) => {
  await page.getByTestId('saved-view-save').click();
  const input = page.getByTestId('saved-view-name');
  await input.fill(name);
  await input.press('Enter');
});

When('the user applies the saved view {string}', async ({ page }, name: string) => {
  await page.getByTestId('saved-views').getByText(name, { exact: true }).click();
});
