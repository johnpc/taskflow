import { describe, it, expect, vi, beforeEach } from 'vitest';

const { get, update } = vi.hoisted(() => ({ get: vi.fn(), update: vi.fn() }));
vi.mock('../../lib/dataClient', () => ({ dataClient: { models: { Task: { get, update } } } }));

import { addLabelToTasks, removeLabelFromTasks } from './bulkLabelApi';

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

  it('throws when a task update errors', async () => {
    get.mockResolvedValue({ data: { id: 'a', labelIds: [] } });
    update.mockResolvedValue({ errors: [{ message: 'boom' }] });
    await expect(addLabelToTasks(['a'], 'lbl')).rejects.toThrow('Bulk label failed');
  });
});

describe('removeLabelFromTasks', () => {
  it('drops the label id from each task, preserving the others', async () => {
    get.mockImplementation(({ id }: { id: string }) =>
      Promise.resolve({ data: { id, labelIds: id === 'a' ? ['lbl', 'x'] : ['lbl'] } }),
    );
    await removeLabelFromTasks(['a', 'b'], 'lbl');
    expect(update).toHaveBeenCalledWith({ id: 'a', labelIds: ['x'] });
    expect(update).toHaveBeenCalledWith({ id: 'b', labelIds: [] });
  });

  it('skips a missing task', async () => {
    get.mockResolvedValue({ data: null });
    await removeLabelFromTasks(['gone'], 'lbl');
    expect(update).not.toHaveBeenCalled();
  });
});
