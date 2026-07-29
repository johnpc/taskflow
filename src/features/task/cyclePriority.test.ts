import { describe, it, expect } from 'vitest';
import { cyclePriority } from './cyclePriority';

describe('cyclePriority', () => {
  it('cycles NONE → LOW → MEDIUM → HIGH → NONE', () => {
    expect(cyclePriority('NONE')).toBe('LOW');
    expect(cyclePriority('LOW')).toBe('MEDIUM');
    expect(cyclePriority('MEDIUM')).toBe('HIGH');
    expect(cyclePriority('HIGH')).toBe('NONE');
  });

  it('treats null/undefined as NONE', () => {
    expect(cyclePriority(null)).toBe('LOW');
    expect(cyclePriority(undefined)).toBe('LOW');
  });
});
