import { describe, it, expect, beforeEach } from 'vitest';
import { readGroupBy, writeGroupBy } from './groupByStore';

beforeEach(() => localStorage.clear());

describe('groupByStore', () => {
  it('defaults to SECTION with nothing stored', () => {
    expect(readGroupBy('p')).toBe('SECTION');
  });

  it('round-trips a stored choice per project', () => {
    writeGroupBy('p', 'PRIORITY');
    expect(readGroupBy('p')).toBe('PRIORITY');
    expect(readGroupBy('other')).toBe('SECTION');
  });

  it('ignores an invalid stored value', () => {
    localStorage.setItem('tf-groupby-p', 'BOGUS');
    expect(readGroupBy('p')).toBe('SECTION');
  });
});
