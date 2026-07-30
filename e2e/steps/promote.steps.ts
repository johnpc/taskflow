import { createBdd } from 'playwright-bdd';

const { When } = createBdd();

When('the user promotes the subtask', async ({ page }) => {
  await page.getByTestId('task-promote').click();
});
