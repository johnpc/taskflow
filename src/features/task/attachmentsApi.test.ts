import { describe, it, expect, vi, beforeEach } from 'vitest';

const { list, create, del } = vi.hoisted(() => ({ list: vi.fn(), create: vi.fn(), del: vi.fn() }));
vi.mock('../../lib/dataClient', () => ({
  dataClient: {
    models: { Attachment: { listAttachmentByTaskId: list, create, delete: del } },
  },
}));

import { fetchAttachments, addAttachment, removeAttachment } from './attachmentsApi';

beforeEach(() => {
  list.mockReset();
  create.mockReset();
  del.mockReset();
});

describe('attachmentsApi', () => {
  it('lists a task attachments oldest-first, dropping nulls', async () => {
    list.mockResolvedValue({
      data: [{ id: 'b', createdAt: '2026-02' }, null, { id: 'a', createdAt: '2026-01' }],
    });
    const out = await fetchAttachments('t');
    expect(out.map((a) => a.id)).toEqual(['a', 'b']);
  });

  it('adds an attachment, trimming and dropping a blank title', async () => {
    create.mockResolvedValue({ data: { id: 'x' }, errors: null });
    await addAttachment({ taskId: 't', url: '  https://x.co ', title: '  ' });
    expect(create).toHaveBeenCalledWith({ taskId: 't', url: 'https://x.co', title: undefined });
  });

  it('throws when add errors', async () => {
    create.mockResolvedValue({ data: null, errors: [{ message: 'x' }] });
    await expect(addAttachment({ taskId: 't', url: 'https://x.co', title: 'T' })).rejects.toThrow();
  });

  it('removes an attachment by id', async () => {
    del.mockResolvedValue({ errors: null });
    await removeAttachment('a1');
    expect(del).toHaveBeenCalledWith({ id: 'a1' });
  });
});
