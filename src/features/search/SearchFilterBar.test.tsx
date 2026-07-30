import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchFilterBar } from './SearchFilterBar';
import { DEFAULT_SEARCH_FILTERS } from './matchTasks';

const projects = [
  { id: 'p1', name: 'Product Launch' },
  { id: 'p2', name: 'Website Redesign' },
];

describe('SearchFilterBar', () => {
  it('marks the active priority and reports a change', () => {
    const onChange = vi.fn();
    render(
      <SearchFilterBar
        filters={{ priority: 'HIGH', projectId: '', hideDone: false }}
        projects={projects}
        onChange={onChange}
      />,
    );
    expect(screen.getByTestId('search-prio-high')).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByTestId('search-prio-low'));
    expect(onChange).toHaveBeenCalledWith({ priority: 'LOW', projectId: '', hideDone: false });
  });

  it('toggles hide-completed', () => {
    const onChange = vi.fn();
    render(
      <SearchFilterBar filters={DEFAULT_SEARCH_FILTERS} projects={projects} onChange={onChange} />,
    );
    fireEvent.click(screen.getByTestId('search-hide-done'));
    expect(onChange).toHaveBeenCalledWith({ priority: '', projectId: '', hideDone: true });
  });

  it('reports a project selection', () => {
    const onChange = vi.fn();
    render(
      <SearchFilterBar filters={DEFAULT_SEARCH_FILTERS} projects={projects} onChange={onChange} />,
    );
    fireEvent.change(screen.getByTestId('search-project'), { target: { value: 'p2' } });
    expect(onChange).toHaveBeenCalledWith({ priority: '', projectId: 'p2', hideDone: false });
  });
});
