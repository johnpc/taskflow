import { describe, it, expect, beforeEach } from 'vitest';
import { readCalendarView, writeCalendarView } from './calendarViewStore';

describe('calendarViewStore', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to LIST when unset', () => {
    expect(readCalendarView()).toBe('LIST');
  });

  it('round-trips the chosen view', () => {
    writeCalendarView('MONTH');
    expect(readCalendarView()).toBe('MONTH');
    writeCalendarView('LIST');
    expect(readCalendarView()).toBe('LIST');
  });
});
