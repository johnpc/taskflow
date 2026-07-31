import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// AssigneeName self-fetches (react-query) — stub it so this stays a bare render.
vi.mock('./AssigneeName', () => ({
  AssigneeName: ({ email }: { email: string | null }) => (
    <span data-testid="row-assignee">{email ?? '—'}</span>
  ),
}));

import { ListRowCells } from './ListRowCells';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', priority: 'NONE', dueDate: null, ...over }) as TaskRecord;

describe('ListRowCells', () => {
  it('sets priority from the dropdown when editable', () => {
    const onQuickEdit = vi.fn();
    render(<ListRowCells task={task({ priority: 'LOW' })} onQuickEdit={onQuickEdit} />);
    fireEvent.change(screen.getByTestId('row-priority'), { target: { value: 'HIGH' } });
    expect(onQuickEdit).toHaveBeenCalledWith({ priority: 'HIGH' });
  });

  it('assigns from the assignee dropdown when editable', () => {
    const onQuickEdit = vi.fn();
    render(<ListRowCells task={task({})} members={['me@x.co']} onQuickEdit={onQuickEdit} />);
    fireEvent.change(screen.getByTestId('task-assignee-select'), { target: { value: 'me@x.co' } });
    expect(onQuickEdit).toHaveBeenCalledWith({ assigneeEmail: 'me@x.co' });
  });

  it('renders read-only cells (no editors) without quick-edit', () => {
    render(<ListRowCells task={task({ dueDate: '2030-05-01', priority: 'HIGH' })} />);
    expect(screen.getByTestId('row-priority')).toHaveTextContent('High');
    expect(screen.getByTestId('row-due')).toBeInTheDocument();
    expect(screen.queryByTestId('row-due-input')).not.toBeInTheDocument();
    expect(screen.queryByTestId('task-assignee-select')).not.toBeInTheDocument();
  });
});
