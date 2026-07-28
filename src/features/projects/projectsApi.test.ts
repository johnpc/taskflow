import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the shared Amplify client before importing the module under test.
// vi.hoisted lets the fns exist above the hoisted vi.mock factory.
const { list, get, create, update } = vi.hoisted(() => ({
  list: vi.fn(),
  get: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
}));
vi.mock('../../lib/dataClient', () => ({
  dataClient: { models: { Project: { list, get, create, update } } },
}));

import { fetchProjects, fetchProject, createProject, setProjectFavorite } from './projectsApi';

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
