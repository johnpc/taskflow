import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterBar } from './FilterBar';
import { DEFAULT_FILTER } from './taskFilter';
import type { CustomFieldRecord, LabelRecord } from '../../lib/dataClient';

const labels: LabelRecord[] = [{ id: 'x', name: 'Urgent' } as LabelRecord];

describe('FilterBar', () => {
  it('toggles completed visibility', () => {
    const onChange = vi.fn();
    render(<FilterBar filter={DEFAULT_FILTER} labels={labels} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('toggle-completed'));
    expect(onChange).toHaveBeenCalledWith({ hideDone: false });
  });

  it('filters by a label', () => {
    const onChange = vi.fn();
    render(<FilterBar filter={DEFAULT_FILTER} labels={labels} onChange={onChange} />);
    fireEvent.change(screen.getByTestId('filter-label'), { target: { value: 'x' } });
    expect(onChange).toHaveBeenCalledWith({ labelId: 'x' });
  });

  it('changes the sort', () => {
    const onChange = vi.fn();
    render(<FilterBar filter={DEFAULT_FILTER} labels={labels} onChange={onChange} />);
    fireEvent.change(screen.getByTestId('filter-sort'), { target: { value: 'priority' } });
    expect(onChange).toHaveBeenCalledWith({ sort: 'priority' });
  });

  it('shows the hide-completed label when done are visible', () => {
    render(
      <FilterBar
        filter={{ ...DEFAULT_FILTER, hideDone: false }}
        labels={labels}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByTestId('toggle-completed')).toHaveTextContent('Hide completed');
  });

  it('hides the clear-filters chip when no facets are active', () => {
    render(<FilterBar filter={DEFAULT_FILTER} labels={labels} onChange={vi.fn()} />);
    expect(screen.queryByTestId('filter-clear')).toBeNull();
  });

  it('renders a custom-field facet for a SELECT field', () => {
    const customFields = [
      { id: 'st', name: 'Stage', fieldType: 'SELECT', options: ['Todo'] } as CustomFieldRecord,
    ];
    render(
      <FilterBar
        filter={DEFAULT_FILTER}
        labels={labels}
        customFields={customFields}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByTestId('filter-cf-field')).toBeInTheDocument();
  });

  it('shows a count and clears facets (keeping hideDone + sort)', () => {
    const onChange = vi.fn();
    render(
      <FilterBar
        filter={{ ...DEFAULT_FILTER, hideDone: false, sort: 'due', priority: 'HIGH', labelId: 'x' }}
        labels={labels}
        onChange={onChange}
      />,
    );
    const clear = screen.getByTestId('filter-clear');
    expect(clear).toHaveTextContent('Clear filters (2)');
    fireEvent.click(clear);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ priority: '', labelId: '', hideDone: false, sort: 'due' }),
    );
  });
});
