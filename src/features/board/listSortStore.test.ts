import { describe, it, expect, beforeEach } from 'vitest';
import { readListSort, writeListSort } from './listSortStore';

beforeEach(() => localStorage.clear());

describe('listSortStore', () => {
  it('defaults to manual/asc with nothing stored', () => {
    expect(readListSort('p')).toEqual({ key: 'manual', dir: 'asc' });
  });

  it('round-trips a stored sort per project', () => {
    writeListSort('p', { key: 'due', dir: 'desc' });
    expect(readListSort('p')).toEqual({ key: 'due', dir: 'desc' });
    expect(readListSort('other')).toEqual({ key: 'manual', dir: 'asc' });
  });

  it('ignores a malformed stored value', () => {
    localStorage.setItem('tf-listsort-p', 'bogus:sideways');
    expect(readListSort('p')).toEqual({ key: 'manual', dir: 'asc' });
  });
});
