import { describe, it, expect, vi, beforeEach } from 'vitest';

const { get, update } = vi.hoisted(() => ({ get: vi.fn(), update: vi.fn() }));
vi.mock('../../lib/dataClient', () => ({ dataClient: { models: { Task: { get, update } } } }));

import { addLabelToTasks } from './bulkLabelApi';

beforeEach(() => {
  get.mockReset();
  update.mockReset().mockResolvedValue({ errors: null });
});

describe('addLabelToTasks', () => {
  it('merges the label id into each task, preserving existing labels', async () => {
    get.mockImplementation(({ id }: { id: string }) =>
      Promise.resolve({ data: { id, labelIds: id === 'a' ? ['x'] : [] } }),
    );
    await addLabelToTasks(['a', 'b'], 'lbl');
    expect(update).toHaveBeenCalledWith({ id: 'a', labelIds: ['x', 'lbl'] });
    expect(update).toHaveBeenCalledWith({ id: 'b', labelIds: ['lbl'] });
  });

  it('skips a missing task', async () => {
    get.mockResolvedValue({ data: null });
    await addLabelToTasks(['gone'], 'lbl');
    expect(update).not.toHaveBeenCalled();
  });
});
