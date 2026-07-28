import { describe, it, expect } from 'vitest';
import { todayISO, nowISO } from './today';

describe('today helpers', () => {
  it('todayISO is a YYYY-MM-DD string', () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it('nowISO is an ISO-8601 timestamp', () => {
    expect(nowISO()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });
});
