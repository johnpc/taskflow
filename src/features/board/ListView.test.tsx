import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import { ListView } from './ListView';
import type { Column } from './taskGrouping';
import type { SectionRecord, TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', priority: 'NONE', dueDate: null, ...over }) as TaskRecord;

const columns: Column[] = [
  {
    section: { id: 's1', name: 'To do' } as SectionRecord,
    tasks: [task({ id: 'a', title: 'Alpha', priority: 'HIGH' })],
  },
];

describe('ListView', () => {
  it('renders the group-by picker and section groups by default', () => {
    renderWithProviders(
      <ListView
        columns={columns}
        groupBy="SECTION"
        onGroupBy={vi.fn()}
        onAddTask={vi.fn()}
        onToggleDone={vi.fn()}
      />,
    );
    expect(screen.getByTestId('list-group-by')).toBeInTheDocument();
    expect(screen.getByText('To do')).toBeInTheDocument();
    expect(screen.getByTestId('add-card')).toBeInTheDocument();
  });

  it('regroups by priority and hides the add composer', () => {
    renderWithProviders(
      <ListView
        columns={columns}
        groupBy="PRIORITY"
        onGroupBy={vi.fn()}
        onAddTask={vi.fn()}
        onToggleDone={vi.fn()}
      />,
    );
    expect(screen.getByText('High priority')).toBeInTheDocument();
    expect(screen.queryByTestId('add-card')).not.toBeInTheDocument();
  });

  it('reports a group-by change', () => {
    const onGroupBy = vi.fn();
    renderWithProviders(
      <ListView
        columns={columns}
        groupBy="SECTION"
        onGroupBy={onGroupBy}
        onAddTask={vi.fn()}
        onToggleDone={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByTestId('list-group-by-select'), { target: { value: 'ASSIGNEE' } });
    expect(onGroupBy).toHaveBeenCalledWith('ASSIGNEE');
  });
});
