import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchFilterBar } from './SearchFilterBar';
import { DEFAULT_SEARCH_FILTERS } from './matchTasks';

describe('SearchFilterBar', () => {
  it('marks the active priority and reports a change', () => {
    const onChange = vi.fn();
    render(<SearchFilterBar filters={{ priority: 'HIGH', hideDone: false }} onChange={onChange} />);
    expect(screen.getByTestId('search-prio-high')).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByTestId('search-prio-low'));
    expect(onChange).toHaveBeenCalledWith({ priority: 'LOW', hideDone: false });
  });

  it('toggles hide-completed', () => {
    const onChange = vi.fn();
    render(<SearchFilterBar filters={DEFAULT_SEARCH_FILTERS} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('search-hide-done'));
    expect(onChange).toHaveBeenCalledWith({ priority: '', hideDone: true });
  });
});
