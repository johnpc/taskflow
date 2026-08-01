import { describe, it, expect, vi, beforeEach } from 'vitest';

const { list, create, updateProject, membersForProject } = vi.hoisted(() => ({
  list: vi.fn(),
  create: vi.fn(),
  updateProject: vi.fn(),
  membersForProject: vi.fn(),
}));
vi.mock('../../lib/dataClient', () => ({
  dataClient: { models: { StatusUpdate: { listStatusUpdateByProjectId: list, create } } },
}));
vi.mock('./projectsApi', () => ({ updateProject }));
vi.mock('../auth/members', () => ({ membersForProject }));

import { fetchStatusUpdates, postStatusUpdate } from './statusUpdatesApi';

beforeEach(() => {
  list.mockReset();
  create.mockReset();
  updateProject.mockReset().mockResolvedValue(undefined);
  membersForProject.mockReset().mockResolvedValue(['me@x.co']);
});

describe('fetchStatusUpdates', () => {
  it('returns updates newest-first', async () => {
    list.mockResolvedValue({
      data: [
        { id: 'a', createdAt: '2026-01-01' },
        { id: 'b', createdAt: '2026-03-01' },
      ],
    });
    const out = await fetchStatusUpdates('p');
    expect(out.map((u) => u.id)).toEqual(['b', 'a']);
  });
});

describe('postStatusUpdate', () => {
  it('creates the update and sets the project current status + note', async () => {
    create.mockResolvedValue({ data: { id: 'u' }, errors: null });
    await postStatusUpdate({
      projectId: 'p',
      status: 'AT_RISK',
      note: '  slipping ',
      authorEmail: 'me@x.co',
    });
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ projectId: 'p', status: 'AT_RISK', note: 'slipping' }),
    );
    expect(updateProject).toHaveBeenCalledWith({
      id: 'p',
      status: 'AT_RISK',
      statusNote: 'slipping',
    });
  });

  it('throws when the create fails', async () => {
    create.mockResolvedValue({ data: null, errors: [{}] });
    await expect(
      postStatusUpdate({ projectId: 'p', status: 'ON_TRACK', note: '', authorEmail: null }),
    ).rejects.toThrow(/Post status failed/);
  });
});
