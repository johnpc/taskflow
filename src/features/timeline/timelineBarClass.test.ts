import { describe, it, expect } from 'vitest';
import { prioClass } from './timelineBarClass';

describe('prioClass', () => {
  it('colors High and Medium bars', () => {
    expect(prioClass('HIGH')).toBe(' timeline__bar--high');
    expect(prioClass('MEDIUM')).toBe(' timeline__bar--medium');
  });

  it('leaves Low / None / null on the default accent', () => {
    expect(prioClass('LOW')).toBe('');
    expect(prioClass('NONE')).toBe('');
    expect(prioClass(null)).toBe('');
    expect(prioClass(undefined)).toBe('');
  });
});
