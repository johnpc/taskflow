import { createBdd } from 'playwright-bdd';

const { When } = createBdd();

When('the user deletes the task', async ({ page }) => {
  await page.getByTestId('task-delete').click();
  // Confirm in the IonAlert.
  await page.getByRole('button', { name: 'Delete' }).click();
});
