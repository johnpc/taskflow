import { describe, it, expect, beforeEach } from 'vitest';
import { readGroupMode, writeGroupMode } from './groupMode';

describe('groupMode store', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to due', () => {
    expect(readGroupMode()).toBe('due');
  });

  it('round-trips a stored choice', () => {
    writeGroupMode('priority');
    expect(readGroupMode()).toBe('priority');
    writeGroupMode('project');
    expect(readGroupMode()).toBe('project');
  });

  it('ignores a garbage stored value', () => {
    localStorage.setItem('tf-mytasks-group', 'weird');
    expect(readGroupMode()).toBe('due');
  });
});
