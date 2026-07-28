import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the seed client (which otherwise reads amplify_outputs.json + .env on import).
const { createProject, createSection, createTask } = vi.hoisted(() => ({
  createProject: vi.fn(),
  createSection: vi.fn(),
  createTask: vi.fn(),
}));
vi.mock('./seedClient', () => ({
  client: {
    models: {
      Project: { create: createProject },
      Section: { create: createSection },
      Task: { create: createTask },
    },
  },
  OWNER_WRITE: { authMode: 'userPool' },
}));

import { seedWorkspaceData } from './seedWorkspace';
import { seedProjects } from './fixtures/workspace';

beforeEach(() => {
  createProject.mockReset();
  createSection.mockReset();
  createTask.mockReset();
  createProject.mockResolvedValue({ data: { id: 'proj' }, errors: null });
  createSection.mockResolvedValue({ data: { id: 'sec' }, errors: null });
  createTask.mockResolvedValue({ data: { id: 'task' }, errors: null });
});

describe('seedWorkspaceData', () => {
  it('creates every seed project with its sections + tasks + subtasks', async () => {
    const count = await seedWorkspaceData();
    expect(count).toBe(seedProjects.length);

    const projects = seedProjects.length;
    const sections = seedProjects.reduce((n, p) => n + p.sections.length, 0);
    const tasks = seedProjects.reduce((n, p) => n + p.tasks.length, 0);
    const subtasks = seedProjects.reduce(
      (n, p) => n + p.tasks.reduce((m, t) => m + (t.subtasks?.length ?? 0), 0),
      0,
    );
    expect(createProject).toHaveBeenCalledTimes(projects);
    expect(createSection).toHaveBeenCalledTimes(sections);
    expect(createTask).toHaveBeenCalledTimes(tasks + subtasks);
  });

  it('resolves a due offset to a YYYY-MM-DD date on tasks that have one', async () => {
    await seedWorkspaceData();
    const withDue = createTask.mock.calls.find(([arg]) => typeof arg.dueDate === 'string');
    expect(withDue?.[0].dueDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('throws when a project create errors', async () => {
    createProject.mockResolvedValueOnce({ data: null, errors: [{ message: 'no' }] });
    await expect(seedWorkspaceData()).rejects.toThrow();
  });
});
