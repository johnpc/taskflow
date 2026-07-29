import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When } = createBdd();

When('the user moves the task to the {string} project', async ({ page }, name: string) => {
  await page.getByTestId('task-project-select').selectOption({ label: name });
  // The move round-trips (fetch target sections → patch → refetch). The detail
  // now reflects the new project, so its project picker shows the target — wait
  // for that so navigation doesn't race the mutation.
  await expect(page.getByTestId('task-project-select')).toHaveValue(/.+/, { timeout: 15_000 });
  await expect(page.getByTestId('task-project-select').locator('option:checked')).toHaveText(name, {
    timeout: 15_000,
  });
});
