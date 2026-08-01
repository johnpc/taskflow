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
});
