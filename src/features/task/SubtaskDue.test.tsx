import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SubtaskDue } from './SubtaskDue';

const today = '2026-07-30';

describe('SubtaskDue', () => {
  it('renders nothing when undated and read-only', () => {
    const { container } = render(<SubtaskDue dueDate={null} done={false} today={today} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows a colored chip for a dated read-only subtask', () => {
    render(<SubtaskDue dueDate="2000-01-01" done={false} today={today} />);
    expect(screen.getByTestId('subtask-due')).toHaveClass('subtask__due--overdue');
    expect(screen.queryByTestId('subtask-due-edit')).not.toBeInTheDocument();
  });

  it('shows a "Due date" affordance when undated + editable', () => {
    render(<SubtaskDue dueDate={null} done={false} today={today} onSetDue={vi.fn()} />);
    expect(screen.getByTestId('subtask-due')).toHaveTextContent('Due date');
    expect(screen.getByTestId('subtask-due-edit')).toBeInTheDocument();
  });

  it('emits the picked date, and null when cleared', () => {
    const onSetDue = vi.fn();
    render(<SubtaskDue dueDate="2026-08-01" done={false} today={today} onSetDue={onSetDue} />);
    const input = screen.getByLabelText('Set subtask due date');
    fireEvent.change(input, { target: { value: '2026-08-05' } });
    expect(onSetDue).toHaveBeenCalledWith('2026-08-05');
    fireEvent.change(input, { target: { value: '' } });
    expect(onSetDue).toHaveBeenCalledWith(null);
  });
});
