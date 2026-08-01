import { describe, it, expect } from 'vitest';
import { withLabelId } from './withLabelId';

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
