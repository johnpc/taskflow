import { describe, it, expect } from 'vitest';
import { resolveLabels, toggleLabelId } from './resolveLabels';
import type { LabelRecord } from '../../lib/dataClient';

const reg: LabelRecord[] = [
  { id: 'a', name: 'Marketing' } as LabelRecord,
  { id: 'b', name: 'Design' } as LabelRecord,
  { id: 'c', name: 'Urgent' } as LabelRecord,
];

describe('resolveLabels', () => {
  it('maps ids to records in registry order', () => {
    expect(resolveLabels(['c', 'a'], reg).map((l) => l.id)).toEqual(['a', 'c']);
  });
  it('drops unknown ids and nulls', () => {
    expect(resolveLabels(['a', 'zzz', null], reg).map((l) => l.id)).toEqual(['a']);
  });
  it('returns empty for null/undefined', () => {
    expect(resolveLabels(null, reg)).toEqual([]);
    expect(resolveLabels(undefined, reg)).toEqual([]);
  });
});

describe('toggleLabelId', () => {
  it('adds a missing id', () => {
    expect(toggleLabelId(['a'], 'b').sort()).toEqual(['a', 'b']);
  });
  it('removes a present id', () => {
    expect(toggleLabelId(['a', 'b'], 'a')).toEqual(['b']);
  });
  it('handles null input', () => {
    expect(toggleLabelId(null, 'a')).toEqual(['a']);
  });
});
