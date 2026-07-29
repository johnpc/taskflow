import { describe, it, expect } from 'vitest';
import { safeHref } from './safeHref';

describe('safeHref', () => {
  it('allows http(s) and mailto', () => {
    expect(safeHref('https://example.com')).toBe('https://example.com');
    expect(safeHref('http://x.io/y')).toBe('http://x.io/y');
    expect(safeHref('mailto:a@b.co')).toBe('mailto:a@b.co');
  });

  it('rejects javascript / data / vbscript and junk', () => {
    expect(safeHref('javascript:alert(1)')).toBeNull();
    expect(safeHref('JAVASCRIPT:alert(1)')).toBeNull();
    expect(safeHref('data:text/html,<script>')).toBeNull();
    expect(safeHref('vbscript:msgbox')).toBeNull();
    expect(safeHref('/relative')).toBeNull();
    expect(safeHref('  ')).toBeNull();
  });
});
