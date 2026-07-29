import { describe, it, expect, vi, beforeEach } from 'vitest';

const { get, create } = vi.hoisted(() => ({ get: vi.fn(), create: vi.fn() }));
vi.mock('../../lib/dataClient', () => ({
  dataClient: { models: { Task: { get, create } } },
}));

import { spawnNextOccurrence } from './spawnRecurrence';

beforeEach(() => {
  get.mockReset();
  create.mockReset();
  create.mockResolvedValue({ data: { id: 'new' } });
});

describe('spawnNextOccurrence', () => {
  it('creates the next occurrence with the due date advanced', async () => {
    get.mockResolvedValue({
      data: {
        id: 't',
        projectId: 'p',
        sectionId: 's',
        title: 'Standup',
        status: 'DONE',
        priority: 'LOW',
        dueDate: '2026-07-28',
        repeat: 'WEEKLY',
        sortOrder: 2,
        labelIds: ['l1', null],
      },
    });
    await spawnNextOccurrence('t');
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: 'p',
        title: 'Standup',
        status: 'TODO',
        dueDate: '2026-08-04',
        repeat: 'WEEKLY',
        labelIds: ['l1'],
      }),
    );
  });

  it('does nothing for a non-recurring task', async () => {
    get.mockResolvedValue({ data: { id: 't', repeat: 'NONE', dueDate: '2026-07-28' } });
    await spawnNextOccurrence('t');
    expect(create).not.toHaveBeenCalled();
  });

  it('does nothing when a recurring task has no due date', async () => {
    get.mockResolvedValue({ data: { id: 't', repeat: 'WEEKLY', dueDate: null } });
    await spawnNextOccurrence('t');
    expect(create).not.toHaveBeenCalled();
  });
});
