import { describe, it, expect } from 'vitest';
import { readCustomValues, setCustomValue, serializeCustomValues } from './customValues';
import type { TaskRecord } from '../../lib/dataClient';

const task = (customValues: unknown): Pick<TaskRecord, 'customValues'> =>
  ({ customValues }) as Pick<TaskRecord, 'customValues'>;

describe('readCustomValues', () => {
  it('parses a JSON-string map, dropping non-strings and tolerating junk', () => {
    expect(readCustomValues(task(JSON.stringify({ f1: 'hi', f2: 3, f3: 'yo' })))).toEqual({
      f1: 'hi',
      f3: 'yo',
    });
    expect(readCustomValues(task(null))).toEqual({});
    expect(readCustomValues(task('{not json'))).toEqual({});
    expect(readCustomValues(task(JSON.stringify([1, 2])))).toEqual({});
  });
});

describe('setCustomValue', () => {
  it('sets a value and removes it when blanked', () => {
    expect(setCustomValue({ a: '1' }, 'b', '2')).toEqual({ a: '1', b: '2' });
    expect(setCustomValue({ a: '1', b: '2' }, 'b', '  ')).toEqual({ a: '1' });
  });
});

describe('serializeCustomValues', () => {
  it('round-trips through readCustomValues', () => {
    const s = serializeCustomValues({ f1: 'x' });
    expect(readCustomValues(task(s))).toEqual({ f1: 'x' });
  });
});
