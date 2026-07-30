import { describe, it, expect } from 'vitest';
import {
  cleanIds,
  toggleBlockerId,
  blockerTasks,
  isBlocked,
  blockerCandidates,
  blockedIdSet,
  dependentTasks,
} from './dependencies';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', projectId: 'p', ...over }) as TaskRecord;

describe('dependencies', () => {
  it('cleanIds drops nulls', () => {
    expect(cleanIds(['a', null, 'b'])).toEqual(['a', 'b']);
    expect(cleanIds(null)).toEqual([]);
  });

  it('toggleBlockerId adds then removes, order-stable', () => {
    expect(toggleBlockerId(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggleBlockerId(['a', 'b'], 'a')).toEqual(['b']);
  });

  it('blockerTasks resolves ids and drops missing', () => {
    const a = task({ id: 'a' });
    const out = blockerTasks(task({ id: 't', blockedByIds: ['a', 'gone'] }), [a]);
    expect(out.map((t) => t.id)).toEqual(['a']);
  });

  it('isBlocked is true only while a blocker is open', () => {
    const openBlocker = task({ id: 'a', status: 'TODO' });
    const doneBlocker = task({ id: 'a', status: 'DONE' });
    const t = task({ id: 't', blockedByIds: ['a'] });
    expect(isBlocked(t, [openBlocker])).toBe(true);
    expect(isBlocked(t, [doneBlocker])).toBe(false);
    expect(isBlocked(task({ id: 't', blockedByIds: [] }), [openBlocker])).toBe(false);
  });

  it('a blocker pointing at a deleted task is treated as cleared', () => {
    expect(isBlocked(task({ id: 't', blockedByIds: ['gone'] }), [])).toBe(false);
  });

  it('blockerCandidates excludes the task itself and its subtasks', () => {
    const all = [task({ id: 't' }), task({ id: 'sub', parentTaskId: 't' }), task({ id: 'other' })];
    expect(blockerCandidates(task({ id: 't' }), all).map((t) => t.id)).toEqual(['other']);
  });

  it('dependentTasks lists every task that this one blocks', () => {
    const all = [
      task({ id: 't' }),
      task({ id: 'b', blockedByIds: ['t'] }),
      task({ id: 'c', blockedByIds: ['t', 'x'] }),
      task({ id: 'd', blockedByIds: ['other'] }),
    ];
    expect(dependentTasks(task({ id: 't' }), all).map((t) => t.id)).toEqual(['b', 'c']);
  });

  it('dependentTasks is empty when nothing points at the task', () => {
    expect(dependentTasks(task({ id: 't' }), [task({ id: 't' })])).toEqual([]);
  });

  it('blockedIdSet collects every currently-blocked task', () => {
    const all = [
      task({ id: 'a', status: 'TODO' }),
      task({ id: 'b', blockedByIds: ['a'] }),
      task({ id: 'c', blockedByIds: ['a'], status: 'TODO' }),
      task({ id: 'd', status: 'DONE' }),
      task({ id: 'e', blockedByIds: ['d'] }),
    ];
    const set = blockedIdSet(all);
    expect([...set].sort()).toEqual(['b', 'c']);
  });
});
