import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterFacets } from './FilterFacets';
import { DEFAULT_FILTER } from './taskFilter';

describe('FilterFacets', () => {
  it('reports a priority filter change', () => {
    const onChange = vi.fn();
    render(<FilterFacets filter={DEFAULT_FILTER} onChange={onChange} />);
    fireEvent.change(screen.getByTestId('filter-priority'), { target: { value: 'HIGH' } });
    expect(onChange).toHaveBeenCalledWith({ priority: 'HIGH' });
  });

  it('reports a due-window filter change', () => {
    const onChange = vi.fn();
    render(<FilterFacets filter={DEFAULT_FILTER} onChange={onChange} />);
    fireEvent.change(screen.getByTestId('filter-due'), { target: { value: 'overdue' } });
    expect(onChange).toHaveBeenCalledWith({ dueWindow: 'overdue' });
  });

  it('reflects the active facet values', () => {
    render(
      <FilterFacets
        filter={{ ...DEFAULT_FILTER, priority: 'LOW', dueWindow: 'today' }}
        onChange={vi.fn()}
      />,
    );
    expect((screen.getByTestId('filter-priority') as HTMLSelectElement).value).toBe('LOW');
    expect((screen.getByTestId('filter-due') as HTMLSelectElement).value).toBe('today');
  });

  it('shows the assignee filter only for a shared project (>1 member)', () => {
    const { rerender } = render(<FilterFacets filter={DEFAULT_FILTER} onChange={vi.fn()} />);
    expect(screen.queryByTestId('filter-assignee')).not.toBeInTheDocument();
    rerender(
      <FilterFacets filter={DEFAULT_FILTER} members={['a@x.co', 'b@x.co']} onChange={vi.fn()} />,
    );
    expect(screen.getByTestId('filter-assignee')).toBeInTheDocument();
  });

  it('reports an assignee filter change', () => {
    const onChange = vi.fn();
    render(
      <FilterFacets filter={DEFAULT_FILTER} members={['a@x.co', 'b@x.co']} onChange={onChange} />,
    );
    fireEvent.change(screen.getByTestId('filter-assignee'), { target: { value: 'b@x.co' } });
    expect(onChange).toHaveBeenCalledWith({ assignee: 'b@x.co' });
  });
});
