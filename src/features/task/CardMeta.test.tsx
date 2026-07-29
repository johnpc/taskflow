import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardMeta } from './CardMeta';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', priority: 'NONE', dueDate: null, ...over }) as TaskRecord;

describe('CardMeta', () => {
  it('renders the blocked badge, due chip, and priority', () => {
    render(
      <CardMeta task={task({ dueDate: '2000-01-01', priority: 'HIGH' })} labels={[]} blocked />,
    );
    expect(screen.getByTestId('task-blocked')).toBeInTheDocument();
    expect(screen.getByTestId('task-due')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('shows a repeat badge only when the task recurs', () => {
    const { rerender } = render(<CardMeta task={task({})} labels={[]} />);
    expect(screen.queryByTestId('task-repeat-badge')).not.toBeInTheDocument();
    rerender(<CardMeta task={task({ repeat: 'DAILY' })} labels={[]} />);
    expect(screen.getByTestId('task-repeat-badge')).toBeInTheDocument();
  });

  it('omits chips when nothing is set', () => {
    render(<CardMeta task={task({})} labels={[]} />);
    expect(screen.queryByTestId('task-blocked')).not.toBeInTheDocument();
    expect(screen.queryByTestId('task-due')).not.toBeInTheDocument();
  });
});
