import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Then } = createBdd();

Then(
  'the {string} card shows the project {string}',
  async ({ page }, title: string, project: string) => {
    const card = page.getByTestId('task-card').filter({ hasText: title }).first();
    await expect(card.getByTestId('task-project')).toContainText(project, { timeout: 15_000 });
  },
);
