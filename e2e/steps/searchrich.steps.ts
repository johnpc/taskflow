import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

Then(
  'a search result {string} shows the project {string}',
  async ({ page }, title: string, project: string) => {
    const hit = page.getByTestId('search-hit').filter({ hasText: title }).first();
    await expect(hit.getByTestId('hit-project')).toContainText(project, { timeout: 15_000 });
  },
);

When('the user filters search to the project {string}', async ({ page }, project: string) => {
  await page.getByTestId('search-project').selectOption({ label: project });
});

Then(/^exactly (\d+) search results? (?:is|are) shown$/, async ({ page }, count: string) => {
  await expect(page.getByTestId('search-hit')).toHaveCount(Number(count), { timeout: 15_000 });
});
