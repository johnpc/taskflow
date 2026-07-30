import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ListRowChips } from './ListRowChips';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', ...over }) as TaskRecord;

describe('ListRowChips', () => {
  it('renders nothing when there are no chips', () => {
    const { container } = render(<ListRowChips task={task({})} labels={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows milestone, blocked, subtask, and label chips', () => {
    render(
      <ListRowChips
        task={task({ isMilestone: true })}
        labels={[{ id: 'l', name: 'Urgent', color: 'rose' } as LabelRecord]}
        blocked
        subtasks={{ done: 1, total: 3 }}
      />,
    );
    expect(screen.getByTestId('task-milestone')).toBeInTheDocument();
    expect(screen.getByTestId('task-blocked')).toBeInTheDocument();
    expect(screen.getByTestId('task-subs')).toHaveTextContent('1/3');
    expect(screen.getByText('Urgent')).toBeInTheDocument();
  });
});
