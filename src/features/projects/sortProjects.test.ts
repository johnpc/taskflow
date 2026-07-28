import { describe, it, expect } from 'vitest';
import { sortProjects } from './sortProjects';
import type { ProjectRecord } from '../../lib/dataClient';

const p = (over: Partial<ProjectRecord>): ProjectRecord =>
  ({ id: 'x', name: 'X', sortOrder: 0, favorite: false, ...over }) as ProjectRecord;

describe('sortProjects', () => {
  it('puts favorites first', () => {
    const out = sortProjects([
      p({ id: 'a', name: 'A', favorite: false, sortOrder: 0 }),
      p({ id: 'b', name: 'B', favorite: true, sortOrder: 5 }),
    ]);
    expect(out.map((x) => x.id)).toEqual(['b', 'a']);
  });

  it('orders by sortOrder within the same favorite group', () => {
    const out = sortProjects([
      p({ id: 'a', sortOrder: 2 }),
      p({ id: 'b', sortOrder: 1 }),
      p({ id: 'c', sortOrder: 3 }),
    ]);
    expect(out.map((x) => x.id)).toEqual(['b', 'a', 'c']);
  });

  it('falls back to name when order ties', () => {
    const out = sortProjects([
      p({ id: 'a', name: 'Zed', sortOrder: 0 }),
      p({ id: 'b', name: 'Alpha', sortOrder: 0 }),
    ]);
    expect(out.map((x) => x.name)).toEqual(['Alpha', 'Zed']);
  });

  it('does not mutate the input array', () => {
    const input = [p({ id: 'a', sortOrder: 2 }), p({ id: 'b', sortOrder: 1 })];
    const copy = [...input];
    sortProjects(input);
    expect(input).toEqual(copy);
  });
});
