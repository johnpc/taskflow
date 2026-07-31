import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ApprovalPicker } from './ApprovalPicker';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', ...over }) as TaskRecord;

describe('ApprovalPicker', () => {
  it('reflects the current approval and defaults to NONE', () => {
    const { rerender } = render(<ApprovalPicker task={task({})} onChange={vi.fn()} />);
    expect(screen.getByTestId('task-approval')).toHaveValue('NONE');
    rerender(<ApprovalPicker task={task({ approval: 'APPROVED' })} onChange={vi.fn()} />);
    expect(screen.getByTestId('task-approval')).toHaveValue('APPROVED');
  });

  it('emits the chosen approval', () => {
    const onChange = vi.fn();
    render(<ApprovalPicker task={task({})} onChange={onChange} />);
    fireEvent.change(screen.getByTestId('task-approval'), { target: { value: 'REJECTED' } });
    expect(onChange).toHaveBeenCalledWith('REJECTED');
  });
});
