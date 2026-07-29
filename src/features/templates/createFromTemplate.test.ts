import { describe, it, expect, vi, beforeEach } from 'vitest';

const { createProject, createSection, createTask } = vi.hoisted(() => ({
  createProject: vi.fn(),
  createSection: vi.fn(),
  createTask: vi.fn(),
}));
vi.mock('../../lib/dataClient', () => ({
  dataClient: {
    models: {
      Project: { create: createProject },
      Section: { create: createSection },
      Task: { create: createTask },
    },
  },
}));

import { createFromTemplate } from './createFromTemplate';
import type { ProjectTemplate } from './templateCatalog';

const template: ProjectTemplate = {
  key: 't',
  name: 'Sprint',
  color: 'indigo',
  description: 'd',
  sections: ['Backlog', 'Done'],
  tasks: [{ title: 'Plan', section: 'Backlog' }],
};

beforeEach(() => {
  createProject.mockReset();
  createSection.mockReset();
  createTask.mockReset();
  createProject.mockResolvedValue({ data: { id: 'p' }, errors: null });
  createSection.mockImplementation((s) => Promise.resolve({ data: { id: `sec-${s.name}` } }));
  createTask.mockResolvedValue({ data: { id: 'task' } });
});

describe('createFromTemplate', () => {
  it('creates the project, its sections, and its tasks in the right section', async () => {
    const id = await createFromTemplate(template, 3);
    expect(id).toBe('p');
    expect(createProject).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Sprint', sortOrder: 3, description: 'd' }),
    );
    expect(createSection).toHaveBeenCalledTimes(2);
    expect(createTask).toHaveBeenCalledWith(
      expect.objectContaining({ projectId: 'p', title: 'Plan', sectionId: 'sec-Backlog' }),
    );
  });

  it('throws when the project create fails', async () => {
    createProject.mockResolvedValue({ data: null, errors: [{}] });
    await expect(createFromTemplate(template, 0)).rejects.toThrow();
  });
});
