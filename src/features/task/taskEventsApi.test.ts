import { describe, it, expect, vi, beforeEach } from 'vitest';

const { create, list, currentEmail, membersForTask } = vi.hoisted(() => ({
  create: vi.fn(),
  list: vi.fn(),
  currentEmail: vi.fn(),
  membersForTask: vi.fn(),
}));
vi.mock('../../lib/dataClient', () => ({
  dataClient: { models: { TaskEvent: { create, listTaskEventByTaskId: list } } },
}));
vi.mock('../auth/authClient', () => ({ currentEmail }));
vi.mock('../auth/members', () => ({ membersForTask }));

import { logTaskEvent, fetchTaskEvents } from './taskEventsApi';

beforeEach(() => {
  create.mockReset();
  list.mockReset();
  currentEmail.mockReset().mockResolvedValue('me@x.co');
  membersForTask.mockReset().mockResolvedValue(['me@x.co']);
});

describe('taskEventsApi', () => {
  it('logs an event with the actor + members', async () => {
    create.mockResolvedValue({ data: { id: 'e' } });
    await logTaskEvent('t1', 'COMPLETED');
    expect(create).toHaveBeenCalledWith({
      taskId: 't1',
      kind: 'COMPLETED',
      actorEmail: 'me@x.co',
      members: ['me@x.co'],
    });
  });

  it('lists events oldest-first, dropping nulls', async () => {
    list.mockResolvedValue({
      data: [
        { id: 'b', kind: 'COMPLETED', actorEmail: null, createdAt: '2026-02' },
        null,
        { id: 'a', kind: 'CREATED', actorEmail: 'x', createdAt: '2026-01' },
      ],
    });
    const events = await fetchTaskEvents('t1');
    expect(events.map((e) => e.id)).toEqual(['a', 'b']);
  });
});
