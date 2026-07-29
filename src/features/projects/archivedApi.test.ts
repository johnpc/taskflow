import { describe, it, expect, vi, beforeEach } from 'vitest';

const { list, update } = vi.hoisted(() => ({ list: vi.fn(), update: vi.fn() }));
vi.mock('../../lib/dataClient', () => ({
  dataClient: { models: { Project: { list, update } } },
}));

import { fetchArchivedProjects, unarchiveProject } from './archivedApi';

beforeEach(() => {
  list.mockReset();
  update.mockReset();
});

describe('archivedApi', () => {
  it('returns only archived projects', async () => {
    list.mockResolvedValue({
      data: [
        { id: 'a', name: 'A', isArchived: true, sortOrder: 0, favorite: false },
        { id: 'b', name: 'B', isArchived: false, sortOrder: 1, favorite: false },
      ],
    });
    const out = await fetchArchivedProjects();
    expect(out.map((p) => p.id)).toEqual(['a']);
  });

  it('unarchives by clearing isArchived', async () => {
    update.mockResolvedValue({ errors: null });
    await unarchiveProject('a');
    expect(update).toHaveBeenCalledWith({ id: 'a', isArchived: false });
  });

  it('throws when restore errors', async () => {
    update.mockResolvedValue({ errors: [{ message: 'x' }] });
    await expect(unarchiveProject('a')).rejects.toThrow();
  });
});
