import { describe, it, expect } from 'vitest';
import { withLabelId, withoutLabelId } from './withLabelId';

describe('withLabelId', () => {
  it('adds a new label id', () => {
    expect(withLabelId(['a'], 'b')).toEqual(['a', 'b']);
  });
  it('is idempotent (no duplicate)', () => {
    expect(withLabelId(['a', 'b'], 'b')).toEqual(['a', 'b']);
  });
  it('handles null/blank noise', () => {
    expect(withLabelId([null, '', 'a'], 'c')).toEqual(['a', 'c']);
    expect(withLabelId(null, 'x')).toEqual(['x']);
  });
});

describe('withoutLabelId', () => {
  it('removes the given label id', () => {
    expect(withoutLabelId(['a', 'b'], 'b')).toEqual(['a']);
  });
  it('is a no-op when the id is absent', () => {
    expect(withoutLabelId(['a', 'b'], 'c')).toEqual(['a', 'b']);
  });
  it('drops null/blank noise and handles empty', () => {
    expect(withoutLabelId([null, '', 'a', 'b'], 'a')).toEqual(['b']);
    expect(withoutLabelId(null, 'x')).toEqual([]);
  });
});
