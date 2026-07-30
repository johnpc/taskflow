import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';

// Self-fetching (react-query) chip child — stub it so rows render deterministically.
vi.mock('../customfields/CardCustomFieldChips', () => ({
  CardCustomFieldChips: () => null,
}));

import { ListRow } from './ListRow';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({
    id: 't',
    title: 'Alpha',
    status: 'TODO',
    priority: 'NONE',
    dueDate: null,
    ...over,
  }) as TaskRecord;

describe('ListRow', () => {
  it('renders the title, assignee, and priority columns', () => {
    renderWithProviders(
      <ListRow
        task={task({ assigneeEmail: 'me@x.co', priority: 'HIGH' })}
        onToggleDone={vi.fn()}
      />,
    );
    expect(screen.getByTestId('task-open')).toHaveTextContent('Alpha');
    expect(screen.getByTestId('row-assignee')).toHaveTextContent('me@x.co');
    expect(screen.getByTestId('row-priority')).toHaveTextContent('High');
  });

  it('shows a dash for an unassigned task', () => {
    renderWithProviders(<ListRow task={task({})} onToggleDone={vi.fn()} />);
    expect(screen.getByTestId('row-assignee')).toHaveTextContent('—');
  });

  it('toggles done via the check', () => {
    const onToggleDone = vi.fn();
    renderWithProviders(<ListRow task={task({})} onToggleDone={onToggleDone} />);
    fireEvent.click(screen.getByTestId('task-check'));
    expect(onToggleDone).toHaveBeenCalled();
  });

  it('edits the due date inline when quick-edit is enabled', () => {
    const onQuickEdit = vi.fn();
    renderWithProviders(
      <ListRow task={task({})} onToggleDone={vi.fn()} onQuickEdit={onQuickEdit} />,
    );
    fireEvent.change(screen.getByTestId('row-due-input'), { target: { value: '2030-01-02' } });
    expect(onQuickEdit).toHaveBeenCalledWith({ dueDate: '2030-01-02' });
  });

  it('sets priority from the dropdown when quick-edit is enabled', () => {
    const onQuickEdit = vi.fn();
    renderWithProviders(
      <ListRow
        task={task({ priority: 'NONE' })}
        onToggleDone={vi.fn()}
        onQuickEdit={onQuickEdit}
      />,
    );
    fireEvent.change(screen.getByTestId('row-priority'), { target: { value: 'LOW' } });
    expect(onQuickEdit).toHaveBeenCalledWith({ priority: 'LOW' });
  });

  it('renders a read-only due label without quick-edit', () => {
    renderWithProviders(<ListRow task={task({ dueDate: '2030-01-02' })} onToggleDone={vi.fn()} />);
    expect(screen.queryByTestId('row-due-input')).not.toBeInTheDocument();
    expect(screen.getByTestId('row-due')).toBeInTheDocument();
  });
});
