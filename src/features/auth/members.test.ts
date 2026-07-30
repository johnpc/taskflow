import { describe, it, expect, vi, beforeEach } from 'vitest';

const { currentEmail, projectGet, taskGet } = vi.hoisted(() => ({
  currentEmail: vi.fn(),
  projectGet: vi.fn(),
  taskGet: vi.fn(),
}));
vi.mock('./authClient', () => ({ currentEmail }));
vi.mock('../../lib/dataClient', () => ({
  dataClient: { models: { Project: { get: projectGet }, Task: { get: taskGet } } },
}));

import { currentMembers, membersForProject, membersForTask } from './members';

beforeEach(() => {
  currentEmail.mockReset();
  projectGet.mockReset();
  taskGet.mockReset();
});

describe('currentMembers', () => {
  it('returns the signed-in email as a one-element list', async () => {
    currentEmail.mockResolvedValue('me@x.co');
    expect(await currentMembers()).toEqual(['me@x.co']);
  });

  it('returns an empty list when signed out', async () => {
    currentEmail.mockResolvedValue(null);
    expect(await currentMembers()).toEqual([]);
  });
});

describe('membersForProject', () => {
  it("copies the project's members when present", async () => {
    projectGet.mockResolvedValue({ data: { members: ['a@x.co', 'b@x.co'] } });
    expect(await membersForProject('p')).toEqual(['a@x.co', 'b@x.co']);
  });

  it('falls back to the creator when the project has no members', async () => {
    projectGet.mockResolvedValue({ data: { members: [] } });
    currentEmail.mockResolvedValue('me@x.co');
    expect(await membersForProject('p')).toEqual(['me@x.co']);
  });

  it('falls back to the creator when the project read throws', async () => {
    projectGet.mockRejectedValue(new Error('nope'));
    currentEmail.mockResolvedValue('me@x.co');
    expect(await membersForProject('p')).toEqual(['me@x.co']);
  });
});

describe('membersForTask', () => {
  it("copies the task's members when present", async () => {
    taskGet.mockResolvedValue({ data: { members: ['a@x.co'] } });
    expect(await membersForTask('t')).toEqual(['a@x.co']);
  });

  it('falls back to the creator when the task read throws', async () => {
    taskGet.mockRejectedValue(new Error('nope'));
    currentEmail.mockResolvedValue('me@x.co');
    expect(await membersForTask('t')).toEqual(['me@x.co']);
  });
});
