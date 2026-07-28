import { describe, it, expect, beforeEach } from 'vitest';
import { readThemePref, writeThemePref, applyThemePref } from './themeStore';

describe('themeStore', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to system', () => {
    expect(readThemePref()).toBe('system');
  });

  it('round-trips a stored preference', () => {
    writeThemePref('dark');
    expect(readThemePref()).toBe('dark');
  });

  it('ignores a garbage stored value', () => {
    localStorage.setItem('tf-theme', 'neon');
    expect(readThemePref()).toBe('system');
  });

  it('applies explicit prefs as data-theme and clears for system', () => {
    const root = document.createElement('html');
    applyThemePref('dark', root);
    expect(root.getAttribute('data-theme')).toBe('dark');
    applyThemePref('light', root);
    expect(root.getAttribute('data-theme')).toBe('light');
    applyThemePref('system', root);
    expect(root.hasAttribute('data-theme')).toBe(false);
  });
});
