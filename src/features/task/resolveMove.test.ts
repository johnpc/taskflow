import { describe, it, expect } from 'vitest';
import { resolveMove } from './resolveMove';
import type { SectionRecord } from '../../lib/dataClient';

const section = (id: string, sortOrder: number): SectionRecord =>
  ({ id, name: id, sortOrder, projectId: 'p2' }) as SectionRecord;

describe('resolveMove', () => {
  it('moves to the target project first section and clears blockers', () => {
    const patch = resolveMove('t', 'p2', [section('b', 1), section('a', 0)]);
    expect(patch).toEqual({ id: 't', projectId: 'p2', sectionId: 'a', blockedByIds: [] });
  });

  it('returns null when the target has no sections', () => {
    expect(resolveMove('t', 'p2', [])).toBeNull();
  });
});
