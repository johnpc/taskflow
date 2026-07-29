import { describe, it, expect } from 'vitest';
import { greeting } from './greeting';

describe('greeting', () => {
  it('picks by hour', () => {
    expect(greeting(2)).toBe('Good night');
    expect(greeting(9)).toBe('Good morning');
    expect(greeting(14)).toBe('Good afternoon');
    expect(greeting(20)).toBe('Good evening');
  });
});
