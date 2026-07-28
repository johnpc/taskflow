import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDocumentTitle } from './useDocumentTitle';

describe('useDocumentTitle', () => {
  it('sets a suffixed title and restores on unmount', () => {
    document.title = 'orig';
    const { unmount } = renderHook(() => useDocumentTitle('Projects'));
    expect(document.title).toBe('Projects · Taskflow');
    unmount();
    expect(document.title).toBe('orig');
  });

  it('uses the base title alone when passed the base', () => {
    renderHook(() => useDocumentTitle('Taskflow'));
    expect(document.title).toBe('Taskflow');
  });

  it('leaves the title untouched when falsy', () => {
    document.title = 'keep';
    renderHook(() => useDocumentTitle(null));
    expect(document.title).toBe('keep');
  });
});
