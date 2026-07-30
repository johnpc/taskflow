import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SavedViewsRegion } from './SavedViewsRegion';
import { DEFAULT_FILTER } from './taskFilter';

beforeEach(() => localStorage.clear());

describe('SavedViewsRegion', () => {
  it('saves the current filter then applies it back', () => {
    const onApply = vi.fn();
    const filter = { ...DEFAULT_FILTER, priority: 'HIGH' as const };
    render(<SavedViewsRegion projectId="p" filter={filter} onApply={onApply} />);
    fireEvent.click(screen.getByTestId('saved-view-save'));
    const input = screen.getByTestId('saved-view-name');
    fireEvent.change(input, { target: { value: 'Hot' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    // The saved chip now exists; applying it passes the saved filter up.
    fireEvent.click(screen.getByText('Hot'));
    expect(onApply).toHaveBeenCalledWith(filter);
  });
});
