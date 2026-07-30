import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ListRowCells } from './ListRowCells';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', priority: 'NONE', dueDate: null, ...over }) as TaskRecord;

describe('ListRowCells', () => {
  it('cycles priority when editable', () => {
    const onQuickEdit = vi.fn();
    render(<ListRowCells task={task({ priority: 'LOW' })} onQuickEdit={onQuickEdit} />);
    fireEvent.click(screen.getByTestId('row-priority'));
    expect(onQuickEdit).toHaveBeenCalledWith({ priority: 'MEDIUM' });
  });

  it('disables the priority cell and shows a read-only due without quick-edit', () => {
    render(<ListRowCells task={task({ dueDate: '2030-05-01' })} />);
    expect(screen.getByTestId('row-priority')).toBeDisabled();
    expect(screen.getByTestId('row-due')).toBeInTheDocument();
    expect(screen.queryByTestId('row-due-input')).not.toBeInTheDocument();
  });
});
