import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BulkSelects } from './BulkSelects';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sections = [{ id: 's1', name: 'To do' }] as any;

describe('BulkSelects', () => {
  it('always shows move; assign + priority only with their handlers', () => {
    const { rerender } = render(<BulkSelects sections={sections} onMove={vi.fn()} />);
    expect(screen.getByTestId('bulk-move')).toBeInTheDocument();
    expect(screen.queryByTestId('bulk-assign')).not.toBeInTheDocument();
    expect(screen.queryByTestId('bulk-priority')).not.toBeInTheDocument();
    rerender(
      <BulkSelects
        sections={sections}
        members={['sam@x.co']}
        onMove={vi.fn()}
        onAssign={vi.fn()}
        onPriority={vi.fn()}
      />,
    );
    expect(screen.getByTestId('bulk-assign')).toBeInTheDocument();
    expect(screen.getByTestId('bulk-priority')).toBeInTheDocument();
  });

  it('delegates the chosen priority', () => {
    const onPriority = vi.fn();
    render(<BulkSelects sections={sections} onMove={vi.fn()} onPriority={onPriority} />);
    fireEvent.change(screen.getByTestId('bulk-priority'), { target: { value: 'HIGH' } });
    expect(onPriority).toHaveBeenCalledWith('HIGH');
  });

  it('shows the label select only with labels + onLabel, and delegates', () => {
    const onLabel = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const labels = [{ id: 'l1', name: 'Bug' }] as any;
    const { rerender } = render(
      <BulkSelects sections={sections} onMove={vi.fn()} onLabel={onLabel} />,
    );
    expect(screen.queryByTestId('bulk-label')).not.toBeInTheDocument(); // no labels yet
    rerender(
      <BulkSelects sections={sections} labels={labels} onMove={vi.fn()} onLabel={onLabel} />,
    );
    fireEvent.change(screen.getByTestId('bulk-label'), { target: { value: 'l1' } });
    expect(onLabel).toHaveBeenCalledWith('l1');
  });
});
