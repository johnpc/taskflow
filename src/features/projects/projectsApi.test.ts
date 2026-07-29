import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the shared Amplify client before importing the module under test.
// vi.hoisted lets the fns exist above the hoisted vi.mock factory.
const {
  list,
  get,
  create,
  update,
  del,
  listSections,
  delSection,
  listTasks,
  delTask,
  listComments,
  delComment,
} = vi.hoisted(() => ({
  list: vi.fn(),
  get: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  del: vi.fn(),
  listSections: vi.fn(),
  delSection: vi.fn(),
  listTasks: vi.fn(),
  delTask: vi.fn(),
  listComments: vi.fn(),
  delComment: vi.fn(),
}));
vi.mock('../../lib/dataClient', () => ({
  dataClient: {
    models: {
      Project: { list, get, create, update, delete: del },
      Section: { listSectionByProjectIdAndSortOrder: listSections, delete: delSection },
      Task: { listTaskByProjectIdAndSortOrder: listTasks, delete: delTask },
      Comment: { listCommentByTaskId: listComments, delete: delComment },
    },
  },
}));

import {
  fetchProjects,
  fetchProject,
  createProject,
  setProjectFavorite,
  updateProject,
  archiveProject,
  deleteProject,
} from './projectsApi';

beforeEach(() => {
  list.mockReset();
  get.mockReset();
  create.mockReset();
  update.mockReset();
});

describe('fetchProjects', () => {
  it('drops archived projects and sorts the rest', async () => {
    list.mockResolvedValue({
      data: [
        { id: 'a', name: 'A', sortOrder: 1, favorite: false, isArchived: false },
        { id: 'b', name: 'B', sortOrder: 0, favorite: false, isArchived: true },
        { id: 'c', name: 'C', sortOrder: 0, favorite: true, isArchived: false },
      ],
    });
    const out = await fetchProjects();
    expect(out.map((p) => p.id)).toEqual(['c', 'a']);
  });
});

describe('fetchProject', () => {
  it('returns the project or null', async () => {
    get.mockResolvedValue({ data: { id: 'x' } });
    expect(await fetchProject('x')).toEqual({ id: 'x' });
    get.mockResolvedValue({ data: null });
    expect(await fetchProject('y')).toBeNull();
  });
});

describe('createProject', () => {
  it('creates with an auto color + order and returns the row', async () => {
    create.mockResolvedValue({ data: { id: 'new' }, errors: null });
    const out = await createProject({ name: '  Launch  ', existingCount: 2 });
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Launch', sortOrder: 2, view: 'BOARD' }),
    );
    expect(out.id).toBe('new');
  });

  it('throws on error', async () => {
    create.mockResolvedValue({ data: null, errors: [{ message: 'nope' }] });
    await expect(createProject({ name: 'X', existingCount: 0 })).rejects.toThrow();
  });
});

describe('setProjectFavorite', () => {
  it('updates the favorite flag', async () => {
    update.mockResolvedValue({ errors: null });
    await setProjectFavorite('x', true);
    expect(update).toHaveBeenCalledWith({ id: 'x', favorite: true });
  });

  it('throws on error', async () => {
    update.mockResolvedValue({ errors: [{ message: 'no' }] });
    await expect(setProjectFavorite('x', false)).rejects.toThrow();
  });
});

describe('updateProject', () => {
  it('patches header fields', async () => {
    update.mockResolvedValue({ errors: null });
    await updateProject({ id: 'x', description: 'plan' });
    expect(update).toHaveBeenCalledWith({ id: 'x', description: 'plan' });
  });

  it('throws on error', async () => {
    update.mockResolvedValue({ errors: [{}] });
    await expect(updateProject({ id: 'x', name: 'Y' })).rejects.toThrow();
  });
});

describe('archiveProject', () => {
  it('sets isArchived', async () => {
    update.mockResolvedValue({ errors: null });
    await archiveProject('x');
    expect(update).toHaveBeenCalledWith({ id: 'x', isArchived: true });
  });
});

describe('deleteProject', () => {
  it('cascades tasks (+comments) and sections, then deletes the project', async () => {
    listSections.mockResolvedValue({ data: [{ id: 's1' }] });
    listTasks.mockResolvedValue({ data: [{ id: 't1' }] });
    listComments.mockResolvedValue({ data: [{ id: 'c1' }] });
    delComment.mockResolvedValue({ errors: null });
    delTask.mockResolvedValue({ errors: null });
    delSection.mockResolvedValue({ errors: null });
    del.mockResolvedValue({ errors: null });
    await deleteProject('p');
    expect(delComment).toHaveBeenCalledWith({ id: 'c1' });
    expect(delTask).toHaveBeenCalledWith({ id: 't1' });
    expect(delSection).toHaveBeenCalledWith({ id: 's1' });
    expect(del).toHaveBeenCalledWith({ id: 'p' });
  });

  it('throws when the final delete errors', async () => {
    listSections.mockResolvedValue({ data: [] });
    listTasks.mockResolvedValue({ data: [] });
    del.mockResolvedValue({ errors: [{}] });
    await expect(deleteProject('p')).rejects.toThrow();
  });
});
