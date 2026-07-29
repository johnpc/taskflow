import { describe, it, expect, vi, beforeEach } from 'vitest';

const { create } = vi.hoisted(() => ({ create: vi.fn() }));
vi.mock('../../lib/dataClient', () => ({
  dataClient: { models: { Task: { create } } },
}));

import { spawnNextOccurrence } from './spawnRecurrence';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', projectId: 'p', title: 'T', status: 'DONE', ...over }) as TaskRecord;

beforeEach(() => {
  create.mockReset();
  create.mockResolvedValue({ data: { id: 'new' } });
});

describe('spawnNextOccurrence', () => {
  it('creates the next occurrence with the due date advanced', async () => {
    await spawnNextOccurrence(
      task({
        sectionId: 's',
        title: 'Standup',
        priority: 'LOW',
        dueDate: '2026-07-28',
        dueTime: '09:00',
        repeat: 'WEEKLY',
        sortOrder: 2,
        labelIds: ['l1', null],
      }),
    );
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: 'p',
        title: 'Standup',
        status: 'TODO',
        dueDate: '2026-08-04',
        dueTime: '09:00',
        repeat: 'WEEKLY',
        labelIds: ['l1'],
      }),
    );
  });

  it('does nothing for a null record or non-recurring task', async () => {
    await spawnNextOccurrence(null);
    await spawnNextOccurrence(task({ repeat: 'NONE', dueDate: '2026-07-28' }));
    expect(create).not.toHaveBeenCalled();
  });

  it('does nothing when a recurring task has no due date', async () => {
    await spawnNextOccurrence(task({ repeat: 'WEEKLY', dueDate: null }));
    expect(create).not.toHaveBeenCalled();
  });
});
