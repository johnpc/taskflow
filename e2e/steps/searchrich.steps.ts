import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Then } = createBdd();

Then(
  'a search result {string} shows the project {string}',
  async ({ page }, title: string, project: string) => {
    const hit = page.getByTestId('search-hit').filter({ hasText: title }).first();
    await expect(hit.getByTestId('hit-project')).toContainText(project, { timeout: 15_000 });
  },
);
