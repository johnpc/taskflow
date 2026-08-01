import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuickEdit } from './QuickEdit';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', priority: 'NONE', dueDate: null, ...over }) as TaskRecord;

describe('QuickEdit', () => {
  it('edits the due date', () => {
    const onEdit = vi.fn();
    render(<QuickEdit task={task({})} onEdit={onEdit} />);
    fireEvent.change(screen.getByTestId('quick-edit-date'), { target: { value: '2026-08-10' } });
    expect(onEdit).toHaveBeenCalledWith({ dueDate: '2026-08-10' });
  });

  it('cycles priority', () => {
    const onEdit = vi.fn();
    render(<QuickEdit task={task({ priority: 'LOW' })} onEdit={onEdit} />);
    fireEvent.click(screen.getByTestId('quick-edit-priority'));
    expect(onEdit).toHaveBeenCalledWith({ priority: 'MEDIUM' });
  });

  it('flags an overdue due date, not a far-future one', () => {
    const { rerender } = render(
      <QuickEdit task={task({ dueDate: '2000-01-01' })} onEdit={vi.fn()} />,
    );
    expect(screen.getByTestId('quick-edit-date')).toHaveClass('quick-edit__date--overdue');
    rerender(<QuickEdit task={task({ dueDate: '2999-01-01' })} onEdit={vi.fn()} />);
    expect(screen.getByTestId('quick-edit-date')).not.toHaveClass('quick-edit__date--overdue');
  });
});
