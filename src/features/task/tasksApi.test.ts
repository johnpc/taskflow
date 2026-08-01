import { describe, it, expect, vi, beforeEach } from 'vitest';

const { create, update, del, spawn, ensureFollower } = vi.hoisted(() => ({
  create: vi.fn(),
  update: vi.fn(),
  del: vi.fn(),
  spawn: vi.fn(),
  ensureFollower: vi.fn(),
}));
vi.mock('../../lib/dataClient', () => ({
  dataClient: { models: { Task: { create, update, delete: del } } },
}));
vi.mock('./spawnRecurrence', () => ({ spawnNextOccurrence: spawn }));
vi.mock('./ensureFollower', () => ({ ensureFollower }));
// Activity logging is best-effort + tested separately — stub it here.
vi.mock('./taskEventsApi', () => ({ logTaskEvent: vi.fn().mockResolvedValue(undefined) }));

import { createTask, setTaskDone, updateTask, deleteTask } from './tasksApi';

beforeEach(() => {
  create.mockReset();
  update.mockReset();
  del.mockReset();
  spawn.mockReset();
  spawn.mockResolvedValue(undefined);
  ensureFollower.mockReset();
  ensureFollower.mockResolvedValue(undefined);
});

describe('createTask', () => {
  it('creates a board card with a section', async () => {
    create.mockResolvedValue({ data: { id: 't' }, errors: null });
    await createTask({ projectId: 'p', sectionId: 's', title: '  Do it ', order: 3 });
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: 'p',
        sectionId: 's',
        title: 'Do it',
        sortOrder: 3,
        status: 'TODO',
      }),
    );
  });

  it('creates a subtask with no section', async () => {
    create.mockResolvedValue({ data: { id: 't' }, errors: null });
    await createTask({ projectId: 'p', title: 'Sub', order: 0, parentTaskId: 'par' });
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ parentTaskId: 'par', sectionId: undefined }),
    );
  });

  it('throws on error', async () => {
    create.mockResolvedValue({ data: null, errors: [{ message: 'x' }] });
    await expect(createTask({ projectId: 'p', title: 'X', order: 0 })).rejects.toThrow();
  });
});

describe('setTaskDone', () => {
  it('stamps completedAt + DONE when completing', async () => {
    update.mockResolvedValue({ errors: null });
    await setTaskDone('t', true, '2026-07-28T00:00:00Z');
    expect(update).toHaveBeenCalledWith({
      id: 't',
      status: 'DONE',
      completedAt: '2026-07-28T00:00:00Z',
    });
  });
  it('clears completedAt + TODO when reopening', async () => {
    update.mockResolvedValue({ errors: null });
    await setTaskDone('t', false, '2026-07-28T00:00:00Z');
    expect(update).toHaveBeenCalledWith({ id: 't', status: 'TODO', completedAt: null });
  });
  it('spawns from the updated record on completion, not on reopen', async () => {
    const updated = { id: 't', status: 'DONE', repeat: 'WEEKLY' };
    update.mockResolvedValue({ data: updated, errors: null });
    await setTaskDone('t', true, 'now');
    expect(spawn).toHaveBeenCalledWith(updated);
    spawn.mockClear();
    await setTaskDone('t', false, 'now');
    expect(spawn).not.toHaveBeenCalled();
  });
  it('throws on error', async () => {
    update.mockResolvedValue({ errors: [{}] });
    await expect(setTaskDone('t', true, 'now')).rejects.toThrow();
  });
});

describe('updateTask', () => {
  it('patches fields', async () => {
    update.mockResolvedValue({ errors: null });
    await updateTask({ id: 't', title: 'New' });
    expect(update).toHaveBeenCalledWith({ id: 't', title: 'New' });
    expect(ensureFollower).not.toHaveBeenCalled();
  });
  it('throws on error', async () => {
    update.mockResolvedValue({ errors: [{}] });
    await expect(updateTask({ id: 't' })).rejects.toThrow();
  });
  it('auto-follows the assignee when the patch sets one', async () => {
    update.mockResolvedValue({ errors: null });
    await updateTask({ id: 't', assigneeEmail: 'sam@x.co' });
    expect(ensureFollower).toHaveBeenCalledWith('t', 'sam@x.co');
  });
});

describe('deleteTask', () => {
  it('deletes by id', async () => {
    del.mockResolvedValue({ errors: null });
    await deleteTask('t');
    expect(del).toHaveBeenCalledWith({ id: 't' });
  });
  it('throws on error', async () => {
    del.mockResolvedValue({ errors: [{}] });
    await expect(deleteTask('t')).rejects.toThrow();
  });
});
