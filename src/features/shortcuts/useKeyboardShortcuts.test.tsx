import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('react-router-dom', () => ({ useHistory: () => ({ push }) }));

import { useKeyboardShortcuts } from './useKeyboardShortcuts';

beforeEach(() => push.mockReset());

describe('useKeyboardShortcuts', () => {
  it('navigates on a g-leader combo', () => {
    renderHook(() => useKeyboardShortcuts());
    act(() => {
      fireEvent.keyDown(document, { key: 'g' });
      fireEvent.keyDown(document, { key: 'p' });
    });
    expect(push).toHaveBeenCalledWith('/projects');
  });

  it('navigates to search on /', () => {
    renderHook(() => useKeyboardShortcuts());
    act(() => fireEvent.keyDown(document, { key: '/' }));
    expect(push).toHaveBeenCalledWith('/search');
  });

  it('toggles help on ?', () => {
    const { result } = renderHook(() => useKeyboardShortcuts());
    act(() => fireEvent.keyDown(document, { key: '?' }));
    expect(result.current.helpOpen).toBe(true);
  });

  it('ignores keys while typing in an input', () => {
    renderHook(() => useKeyboardShortcuts());
    const input = document.createElement('input');
    document.body.appendChild(input);
    act(() => fireEvent.keyDown(input, { key: '/' }));
    expect(push).not.toHaveBeenCalled();
    input.remove();
  });
});
