import { describe, it, expect, vi, beforeEach } from 'vitest';

const { listSections, listTasks, createTask } = vi.hoisted(() => ({
  listSections: vi.fn(),
  listTasks: vi.fn(),
  createTask: vi.fn(),
}));
vi.mock('../../lib/dataClient', () => ({
  dataClient: {
    models: {
      Section: { listSectionByProjectIdAndSortOrder: listSections },
      Task: { listTaskByProjectIdAndSortOrder: listTasks },
    },
  },
}));
vi.mock('../task/tasksApi', () => ({ createTask }));

import { quickAddTask } from './quickAddApi';

beforeEach(() => {
  listSections.mockReset();
  listTasks.mockReset();
  createTask.mockReset();
});

describe('quickAddTask', () => {
  it('creates a task in the first section, appended after the last', async () => {
    listSections.mockResolvedValue({ data: [{ id: 's1' }] });
    listTasks.mockResolvedValue({ data: [{ id: 'a' }, { id: 'b' }] });
    await quickAddTask('p1', 'New task');
    expect(createTask).toHaveBeenCalledWith({
      projectId: 'p1',
      sectionId: 's1',
      title: 'New task',
      order: 2,
    });
  });

  it('falls back to no section when the project has none', async () => {
    listSections.mockResolvedValue({ data: [] });
    listTasks.mockResolvedValue({ data: [] });
    await quickAddTask('p1', 'Solo');
    expect(createTask).toHaveBeenCalledWith({
      projectId: 'p1',
      sectionId: undefined,
      title: 'Solo',
      order: 0,
    });
  });
});
