import { describe, it, expect, vi, beforeEach } from 'vitest';

const { create, listTaskByParentTaskId } = vi.hoisted(() => ({
  create: vi.fn(),
  listTaskByParentTaskId: vi.fn(),
}));
vi.mock('../../lib/dataClient', () => ({
  dataClient: { models: { Task: { create, listTaskByParentTaskId } } },
}));

import { duplicateTask } from './duplicateTaskApi';
import type { TaskRecord } from '../../lib/dataClient';

beforeEach(() => {
  create.mockReset();
  listTaskByParentTaskId.mockReset();
  listTaskByParentTaskId.mockResolvedValue({ data: [] });
});

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

  it('copies the source subtasks under the new parent', async () => {
    create.mockResolvedValue({ data: { id: 'copy' }, errors: null });
    listTaskByParentTaskId.mockResolvedValue({
      data: [{ id: 's1', title: 'Step one', projectId: 'p' }],
    });
    const task = { id: 't', projectId: 'p', title: 'Plan', status: 'TODO' } as TaskRecord;
    await duplicateTask(task, 0);
    expect(listTaskByParentTaskId).toHaveBeenCalledWith({ parentTaskId: 't' }, { limit: 200 });
    // The parent copy + one subtask copy parented to the new task.
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Step one', parentTaskId: 'copy' }),
    );
  });
});
