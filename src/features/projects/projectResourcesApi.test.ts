import { describe, it, expect, vi, beforeEach } from 'vitest';

const { list, create, del, membersForProject } = vi.hoisted(() => ({
  list: vi.fn(),
  create: vi.fn(),
  del: vi.fn(),
  membersForProject: vi.fn(),
}));
vi.mock('../../lib/dataClient', () => ({
  dataClient: {
    models: {
      ProjectResource: { listProjectResourceByProjectId: list, create, delete: del },
    },
  },
}));
vi.mock('../auth/members', () => ({ membersForProject }));

import { fetchResources, addResource, removeResource } from './projectResourcesApi';

beforeEach(() => {
  list.mockReset();
  create.mockReset().mockResolvedValue({ data: { id: 'r' }, errors: null });
  del.mockReset().mockResolvedValue({ errors: null });
  membersForProject.mockReset().mockResolvedValue(['me@x.co']);
});

describe('projectResourcesApi', () => {
  it('lists a project’s resources oldest-first', async () => {
    list.mockResolvedValue({
      data: [
        { id: 'b', createdAt: '2026-02-01' },
        { id: 'a', createdAt: '2026-01-01' },
      ],
    });
    const out = await fetchResources('p1');
    expect(out.map((r) => r.id)).toEqual(['a', 'b']);
  });

  it('adds a resource with trimmed fields + project members', async () => {
    await addResource({ projectId: 'p1', title: '  Spec  ', url: '  https://x.co  ' });
    expect(create).toHaveBeenCalledWith({
      projectId: 'p1',
      title: 'Spec',
      url: 'https://x.co',
      members: ['me@x.co'],
    });
  });

  it('throws when add errors', async () => {
    create.mockResolvedValue({ data: null, errors: [{ message: 'boom' }] });
    await expect(addResource({ projectId: 'p1', title: 'x', url: 'https://x.co' })).rejects.toThrow(
      'Add resource failed',
    );
  });

  it('removes a resource by id', async () => {
    await removeResource('r1');
    expect(del).toHaveBeenCalledWith({ id: 'r1' });
  });
});
