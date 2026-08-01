import { describe, it, expect } from 'vitest';
import { splitFavorites } from './splitFavorites';
import type { ProjectRecord } from '../../lib/dataClient';

const p = (id: string, favorite: boolean): ProjectRecord => ({ id, favorite }) as ProjectRecord;

describe('splitFavorites', () => {
  it('splits starred from the rest, preserving order', () => {
    const { starred, rest } = splitFavorites([p('a', true), p('b', false), p('c', true)]);
    expect(starred.map((x) => x.id)).toEqual(['a', 'c']);
    expect(rest.map((x) => x.id)).toEqual(['b']);
  });

  it('handles no favorites', () => {
    const { starred, rest } = splitFavorites([p('a', false)]);
    expect(starred).toEqual([]);
    expect(rest.map((x) => x.id)).toEqual(['a']);
  });
});
