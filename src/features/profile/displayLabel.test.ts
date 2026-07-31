import { describe, it, expect } from 'vitest';
import { displayLabel, displayInitials } from './displayLabel';

describe('displayLabel', () => {
  it('prefers the display name, falling back to the email', () => {
    expect(displayLabel('a@x.co', 'Ada Lovelace')).toBe('Ada Lovelace');
    expect(displayLabel('a@x.co', null)).toBe('a@x.co');
    expect(displayLabel('a@x.co', '   ')).toBe('a@x.co');
  });
});

describe('displayInitials', () => {
  it('derives initials from the display name when set', () => {
    expect(displayInitials('a@x.co', 'Ada Lovelace')).toBe('AL');
    expect(displayInitials('a@x.co', 'Grace')).toBe('GR');
  });

  it('falls back to email-derived initials without a name', () => {
    expect(displayInitials('ada.lovelace@x.co', null)).toBe('AL');
    expect(displayInitials('grace@x.co', '')).toBe('GR');
  });
});
