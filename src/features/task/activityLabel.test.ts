import { describe, it, expect } from 'vitest';
import { activityLabel } from './activityLabel';

describe('activityLabel', () => {
  it('names the actor + the action', () => {
    expect(activityLabel('CREATED', 'ada@x.co')).toBe('ada@x.co created this task');
    expect(activityLabel('COMPLETED', 'grace@x.co')).toBe('grace@x.co completed this task');
    expect(activityLabel('REOPENED', 'a@x.co')).toBe('a@x.co reopened this task');
  });

  it('falls back to "Someone" for an unknown actor', () => {
    expect(activityLabel('CREATED', null)).toBe('Someone created this task');
  });
});
