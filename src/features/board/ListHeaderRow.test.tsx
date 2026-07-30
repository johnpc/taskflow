import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ListHeaderRow } from './ListHeaderRow';

describe('ListHeaderRow', () => {
  it('renders sortable column buttons and reports a sort', () => {
    const onSort = vi.fn();
    render(<ListHeaderRow sort={{ key: 'manual', dir: 'asc' }} onSort={onSort} />);
    fireEvent.click(screen.getByTestId('list-sort-due'));
    expect(onSort).toHaveBeenCalledWith('due');
  });

  it('marks the active column and shows a direction indicator', () => {
    render(<ListHeaderRow sort={{ key: 'priority', dir: 'desc' }} onSort={vi.fn()} />);
    const active = screen.getByTestId('list-sort-priority');
    expect(active).toHaveAttribute('aria-pressed', 'true');
    expect(active).toHaveTextContent('▼');
  });

  it('renders plain labels when not sortable', () => {
    render(<ListHeaderRow />);
    expect(screen.queryByTestId('list-sort-title')).not.toBeInTheDocument();
    expect(screen.getByText('Task')).toBeInTheDocument();
  });
});
