import { describe, it, expect, vi, beforeEach } from 'vitest';

const { create } = vi.hoisted(() => ({ create: vi.fn() }));
vi.mock('../../lib/dataClient', () => ({ dataClient: { models: { Task: { create } } } }));

import { duplicateTask } from './duplicateTaskApi';
import type { TaskRecord } from '../../lib/dataClient';

beforeEach(() => create.mockReset());

describe('duplicateTask', () => {
  it('creates a "(copy)" at the given order', async () => {
    create.mockResolvedValue({ data: { id: 'copy' }, errors: null });
    const task = { id: 't', projectId: 'p', title: 'Plan', status: 'TODO' } as TaskRecord;
    const out = await duplicateTask(task, 5);
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Plan (copy)', status: 'TODO', sortOrder: 5 }),
    );
    expect(out.id).toBe('copy');
  });

  it('throws when the copy fails', async () => {
    create.mockResolvedValue({ data: null, errors: [{ message: 'no' }] });
    const task = { id: 't', projectId: 'p', title: 'Plan' } as TaskRecord;
    await expect(duplicateTask(task, 0)).rejects.toThrow(/Duplicate task failed/);
  });
});
