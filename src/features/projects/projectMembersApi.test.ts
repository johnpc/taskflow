import { describe, it, expect, vi, beforeEach } from 'vitest';

const h = vi.hoisted(() => ({
  projUpdate: vi.fn(),
  secList: vi.fn(),
  secUpdate: vi.fn(),
  taskList: vi.fn(),
  taskUpdate: vi.fn(),
  commentList: vi.fn(),
  commentUpdate: vi.fn(),
  attachList: vi.fn(),
  attachUpdate: vi.fn(),
}));
vi.mock('../../lib/dataClient', () => ({
  dataClient: {
    models: {
      Project: { update: h.projUpdate },
      Section: { listSectionByProjectIdAndSortOrder: h.secList, update: h.secUpdate },
      Task: { listTaskByProjectIdAndSortOrder: h.taskList, update: h.taskUpdate },
      Comment: { listCommentByTaskId: h.commentList, update: h.commentUpdate },
      Attachment: { listAttachmentByTaskId: h.attachList, update: h.attachUpdate },
    },
  },
}));

import { setProjectMembers } from './projectMembersApi';

beforeEach(() => {
  Object.values(h).forEach((fn) => fn.mockReset());
  h.projUpdate.mockResolvedValue({ errors: null });
  h.secList.mockResolvedValue({ data: [{ id: 's1' }] });
  h.taskList.mockResolvedValue({ data: [{ id: 't1' }] });
  h.commentList.mockResolvedValue({ data: [{ id: 'c1' }] });
  h.attachList.mockResolvedValue({ data: [{ id: 'a1' }] });
});

describe('setProjectMembers', () => {
  it('updates the project and cascades to sections, tasks, comments, attachments', async () => {
    const members = ['owner@x.co', 'alice@x.co'];
    await setProjectMembers('p', members);
    expect(h.projUpdate).toHaveBeenCalledWith({ id: 'p', members });
    expect(h.secUpdate).toHaveBeenCalledWith({ id: 's1', members });
    expect(h.taskUpdate).toHaveBeenCalledWith({ id: 't1', members });
    expect(h.commentUpdate).toHaveBeenCalledWith({ id: 'c1', members });
    expect(h.attachUpdate).toHaveBeenCalledWith({ id: 'a1', members });
  });

  it('throws when the project update errors', async () => {
    h.projUpdate.mockResolvedValue({ errors: [{ message: 'no' }] });
    await expect(setProjectMembers('p', [])).rejects.toThrow();
  });
});
