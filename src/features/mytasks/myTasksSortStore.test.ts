import { describe, it, expect, beforeEach } from 'vitest';
import { readMyTasksSort, writeMyTasksSort } from './myTasksSortStore';

describe('myTasksSortStore', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to manual ascending when unset', () => {
    expect(readMyTasksSort()).toEqual({ key: 'manual', dir: 'asc' });
  });

  it('round-trips a chosen key + direction', () => {
    writeMyTasksSort({ key: 'due', dir: 'desc' });
    expect(readMyTasksSort()).toEqual({ key: 'due', dir: 'desc' });
  });

  it('falls back to the default on an unknown stored key', () => {
    localStorage.setItem('tf-mytasks-sort', 'bogus:asc');
    expect(readMyTasksSort()).toEqual({ key: 'manual', dir: 'asc' });
  });
});
