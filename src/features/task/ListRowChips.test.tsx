import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Self-fetching (react-query) child — stub it so this stays a bare render.
vi.mock('../customfields/CardCustomFieldChips', () => ({
  CardCustomFieldChips: () => null,
}));

import { ListRowChips } from './ListRowChips';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', ...over }) as TaskRecord;

describe('ListRowChips', () => {
  it('renders no base chips when the task has none', () => {
    render(<ListRowChips task={task({})} labels={[]} />);
    expect(screen.queryByTestId('task-milestone')).toBeNull();
    expect(screen.queryByTestId('task-blocked')).toBeNull();
    expect(screen.queryByTestId('task-subs')).toBeNull();
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
