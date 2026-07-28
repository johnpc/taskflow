import { describe, it, expect, vi, beforeEach } from 'vitest';

const { list } = vi.hoisted(() => ({ list: vi.fn() }));
vi.mock('../../lib/dataClient', () => ({
  dataClient: { models: { Task: { list } } },
}));

import { fetchMyTasks } from './myTasksApi';

beforeEach(() => list.mockReset());

describe('fetchMyTasks', () => {
  it('returns top-level tasks, dropping subtasks and nulls', async () => {
    list.mockResolvedValue({
      data: [{ id: 'a', parentTaskId: null }, { id: 'sub', parentTaskId: 'a' }, null, { id: 'b' }],
    });
    const out = await fetchMyTasks();
    expect(out.map((t) => t.id)).toEqual(['a', 'b']);
  });

  it('handles an empty response', async () => {
    list.mockResolvedValue({ data: null });
    expect(await fetchMyTasks()).toEqual([]);
  });
});
