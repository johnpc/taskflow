import { describe, it, expect, vi, beforeEach } from 'vitest';

const { create, listTaskByParentTaskId, attachmentCreate } = vi.hoisted(() => ({
  create: vi.fn(),
  listTaskByParentTaskId: vi.fn(),
  attachmentCreate: vi.fn(),
}));
vi.mock('../../lib/dataClient', () => ({
  dataClient: {
    models: {
      Task: { create, listTaskByParentTaskId },
      Attachment: { create: attachmentCreate },
    },
  },
}));
const { fetchAttachments } = vi.hoisted(() => ({ fetchAttachments: vi.fn() }));
vi.mock('./attachmentsApi', () => ({ fetchAttachments }));

import { duplicateTask } from './duplicateTaskApi';
import type { TaskRecord } from '../../lib/dataClient';

beforeEach(() => {
  create.mockReset();
  listTaskByParentTaskId.mockReset();
  attachmentCreate.mockReset();
  fetchAttachments.mockReset();
  listTaskByParentTaskId.mockResolvedValue({ data: [] });
  fetchAttachments.mockResolvedValue([]);
  attachmentCreate.mockResolvedValue({ data: { id: 'a' }, errors: null });
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
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Step one', parentTaskId: 'copy' }),
    );
  });

  it('copies LINK attachments but skips file attachments', async () => {
    create.mockResolvedValue({ data: { id: 'copy' }, errors: null });
    fetchAttachments.mockResolvedValue([
      { id: 'a1', url: 'https://x.co', title: 'Doc', storageKey: null },
      {
        id: 'a2',
        url: 'file:attachments/t/f.pdf',
        title: 'f.pdf',
        storageKey: 'attachments/t/f.pdf',
      },
    ]);
    const task = { id: 't', projectId: 'p', title: 'Plan', status: 'TODO' } as TaskRecord;
    await duplicateTask(task, 0);
    expect(attachmentCreate).toHaveBeenCalledTimes(1);
    expect(attachmentCreate).toHaveBeenCalledWith(
      expect.objectContaining({ taskId: 'copy', url: 'https://x.co', title: 'Doc' }),
    );
  });
});
