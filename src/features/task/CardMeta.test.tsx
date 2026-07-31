import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
// CardMeta renders CardCustomFieldChips, which fetches via react-query; stub it
// so CardMeta stays a pure presentational render in these tests.
vi.mock('../customfields/CardCustomFieldChips', () => ({ CardCustomFieldChips: () => null }));
vi.mock('./AssigneeAvatar', () => ({ AssigneeAvatar: () => null }));
import { CardMeta } from './CardMeta';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', priority: 'NONE', dueDate: null, ...over }) as TaskRecord;

describe('CardMeta', () => {
  it('shows a project chip only when a project is given', () => {
    const { rerender } = render(<CardMeta task={task({})} labels={[]} />);
    expect(screen.queryByTestId('task-project')).not.toBeInTheDocument();
    rerender(<CardMeta task={task({})} labels={[]} project={{ name: 'Launch', color: 'sky' }} />);
    expect(screen.getByTestId('task-project')).toHaveTextContent('Launch');
  });

  it('renders the blocked badge, due chip, and priority', () => {
    render(
      <CardMeta task={task({ dueDate: '2000-01-01', priority: 'HIGH' })} labels={[]} blocked />,
    );
    expect(screen.getByTestId('task-blocked')).toBeInTheDocument();
    expect(screen.getByTestId('task-due')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('shows a milestone marker when the task is a milestone', () => {
    const { rerender } = render(<CardMeta task={task({})} labels={[]} />);
    expect(screen.queryByTestId('task-milestone')).not.toBeInTheDocument();
    rerender(<CardMeta task={task({ isMilestone: true })} labels={[]} />);
    expect(screen.getByTestId('task-milestone')).toBeInTheDocument();
  });

  it('shows a Starts chip instead of the due chip when not started yet', () => {
    render(
      <CardMeta task={task({ startDate: '2999-01-01', dueDate: '2999-02-01' })} labels={[]} />,
    );
    expect(screen.getByTestId('task-start')).toHaveTextContent('Starts Jan 1');
    expect(screen.queryByTestId('task-due')).not.toBeInTheDocument();
  });

  it('appends the due time to the due chip', () => {
    render(<CardMeta task={task({ dueDate: '2030-01-01', dueTime: '09:00' })} labels={[]} />);
    expect(screen.getByTestId('task-due')).toHaveTextContent('9:00 AM');
  });

  it('shows a subtask chip only when the task has subtasks', () => {
    const { rerender } = render(<CardMeta task={task({})} labels={[]} />);
    expect(screen.queryByTestId('task-subs')).not.toBeInTheDocument();
    rerender(<CardMeta task={task({})} labels={[]} subtasks={{ done: 2, total: 3 }} />);
    expect(screen.getByTestId('task-subs')).toHaveTextContent('2/3');
  });

  it('shows a repeat badge with its cadence only when the task recurs', () => {
    const { rerender } = render(<CardMeta task={task({})} labels={[]} />);
    expect(screen.queryByTestId('task-repeat-badge')).not.toBeInTheDocument();
    rerender(<CardMeta task={task({ repeat: 'WEEKLY' })} labels={[]} />);
    expect(screen.getByTestId('task-repeat-badge')).toHaveTextContent('Weekly');
  });

  it('omits chips when nothing is set', () => {
    render(<CardMeta task={task({})} labels={[]} />);
    expect(screen.queryByTestId('task-blocked')).not.toBeInTheDocument();
    expect(screen.queryByTestId('task-due')).not.toBeInTheDocument();
  });
});
