import { describe, it, expect, vi, beforeEach } from 'vitest';

const { get, update, listSub, listComments, createComment, fetchAttachments } = vi.hoisted(() => ({
  get: vi.fn(),
  update: vi.fn(),
  listSub: vi.fn(),
  listComments: vi.fn(),
  createComment: vi.fn(),
  fetchAttachments: vi.fn(),
}));
vi.mock('../../lib/dataClient', () => ({
  dataClient: {
    models: {
      Task: { get, update, listTaskByParentTaskId: listSub },
      Comment: { listCommentByTaskId: listComments, create: createComment },
    },
  },
}));
vi.mock('./attachmentsApi', () => ({ fetchAttachments }));

import { fetchTaskDetail, addComment } from './taskDetailApi';

beforeEach(() => {
  get.mockReset();
  update.mockReset();
  listSub.mockReset();
  listComments.mockReset();
  createComment.mockReset();
  fetchAttachments.mockReset();
  fetchAttachments.mockResolvedValue([]);
  get.mockResolvedValue({ data: null });
  update.mockResolvedValue({ errors: null });
});

describe('fetchTaskDetail', () => {
  it('loads the task, sorted subtasks, and sorted comments', async () => {
    get.mockResolvedValue({ data: { id: 't', title: 'T' } });
    listSub.mockResolvedValue({
      data: [
        { id: 's2', sortOrder: 2 },
        { id: 's1', sortOrder: 1 },
      ],
    });
    listComments.mockResolvedValue({
      data: [
        { id: 'c2', createdAt: '2026-02' },
        { id: 'c1', createdAt: '2026-01' },
      ],
    });
    fetchAttachments.mockResolvedValue([{ id: 'at1' }]);
    const out = await fetchTaskDetail('t');
    expect(out.task?.id).toBe('t');
    expect(out.subtasks.map((s) => s.id)).toEqual(['s1', 's2']);
    expect(out.comments.map((c) => c.id)).toEqual(['c1', 'c2']);
    expect(out.attachments.map((a) => a.id)).toEqual(['at1']);
  });

  it('returns null task when missing', async () => {
    get.mockResolvedValue({ data: null });
    listSub.mockResolvedValue({ data: [] });
    listComments.mockResolvedValue({ data: [] });
    const out = await fetchTaskDetail('gone');
    expect(out.task).toBeNull();
  });
});

describe('addComment', () => {
  it('creates a trimmed comment', async () => {
    createComment.mockResolvedValue({ data: { id: 'c' }, errors: null });
    await addComment({ taskId: 't', body: '  hi ', authorEmail: 'a@b.co' });
    expect(createComment).toHaveBeenCalledWith(
      expect.objectContaining({ taskId: 't', body: 'hi', authorEmail: 'a@b.co' }),
    );
  });
  it('throws on error', async () => {
    createComment.mockResolvedValue({ data: null, errors: [{}] });
    await expect(addComment({ taskId: 't', body: 'x', authorEmail: null })).rejects.toThrow();
  });

  it('auto-follows the task for the comment author when not already following', async () => {
    createComment.mockResolvedValue({ data: { id: 'c' }, errors: null });
    get.mockResolvedValue({ data: { id: 't', followers: ['other@x.co'] } });
    await addComment({ taskId: 't', body: 'hi', authorEmail: 'a@b.co' });
    expect(update).toHaveBeenCalledWith({ id: 't', followers: ['other@x.co', 'a@b.co'] });
  });

  it('does not re-add an author who already follows', async () => {
    createComment.mockResolvedValue({ data: { id: 'c' }, errors: null });
    get.mockResolvedValue({ data: { id: 't', followers: ['a@b.co'] } });
    await addComment({ taskId: 't', body: 'hi', authorEmail: 'a@b.co' });
    expect(update).not.toHaveBeenCalled();
  });
});
