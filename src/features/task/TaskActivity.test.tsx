import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TaskActivity } from './TaskActivity';
import type { TaskRecord } from '../../lib/dataClient';

const now = Date.parse('2026-07-30T12:00:00Z');
const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', createdAt: null, completedAt: null, ...over }) as TaskRecord;

describe('TaskActivity', () => {
  it('shows created time', () => {
    render(<TaskActivity task={task({ createdAt: '2026-07-30T09:00:00Z' })} nowMs={now} />);
    expect(screen.getByTestId('activity-created')).toHaveTextContent('Created 3h ago');
    expect(screen.queryByTestId('activity-completed')).not.toBeInTheDocument();
  });

  it('adds completed time when done', () => {
    render(
      <TaskActivity
        task={task({ createdAt: '2026-07-28T12:00:00Z', completedAt: '2026-07-30T11:30:00Z' })}
        nowMs={now}
      />,
    );
    expect(screen.getByTestId('activity-completed')).toHaveTextContent('Completed 30m ago');
  });

  it('renders nothing without timestamps', () => {
    const { container } = render(<TaskActivity task={task({})} nowMs={now} />);
    expect(container.firstChild).toBeNull();
  });
});
