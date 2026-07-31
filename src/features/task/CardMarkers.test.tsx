import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardMarkers } from './CardMarkers';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', ...over }) as TaskRecord;

describe('CardMarkers', () => {
  it('shows subtask progress, repeat cadence, and like count when set', () => {
    render(
      <CardMarkers
        task={task({ repeat: 'WEEKLY', likedBy: ['a@x.co'] })}
        subtasks={{ done: 1, total: 2 }}
      />,
    );
    expect(screen.getByTestId('task-subs')).toHaveTextContent('1/2');
    expect(screen.getByTestId('task-repeat-badge')).toHaveTextContent('Weekly');
    expect(screen.getByTestId('task-likes')).toHaveTextContent('1');
  });

  it('renders nothing when nothing is set', () => {
    render(<CardMarkers task={task({})} />);
    expect(screen.queryByTestId('task-subs')).not.toBeInTheDocument();
    expect(screen.queryByTestId('task-repeat-badge')).not.toBeInTheDocument();
    expect(screen.queryByTestId('task-likes')).not.toBeInTheDocument();
  });
});
