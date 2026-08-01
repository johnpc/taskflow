import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// MemberAvatar self-fetches (react-query) — stub it for these bare renders.
vi.mock('../board/MemberAvatar', () => ({
  MemberAvatar: ({ email }: { email: string }) => <span>{email}</span>,
}));

import { TaskFollowers } from './TaskFollowers';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', ...over }) as TaskRecord;

describe('TaskFollowers', () => {
  it('reads "Following" + shows the stack when I follow', () => {
    render(
      <TaskFollowers
        task={task({ followers: ['me@x.co', 'you@x.co'] })}
        currentEmail="me@x.co"
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByTestId('task-follow')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('task-follow')).toHaveTextContent('Following');
    expect(screen.getByTestId('task-followers')).toBeInTheDocument();
  });

  it('reads "Follow" and hides the stack when there are none', () => {
    render(
      <TaskFollowers task={task({ followers: [] })} currentEmail="me@x.co" onChange={vi.fn()} />,
    );
    expect(screen.getByTestId('task-follow')).toHaveTextContent('Follow');
    expect(screen.queryByTestId('task-followers')).not.toBeInTheDocument();
  });

  it('toggles the current user into followers on click', () => {
    const onChange = vi.fn();
    render(
      <TaskFollowers task={task({ followers: [] })} currentEmail="me@x.co" onChange={onChange} />,
    );
    fireEvent.click(screen.getByTestId('task-follow'));
    expect(onChange).toHaveBeenCalledWith(['me@x.co']);
  });

  it('disables Follow when signed-out', () => {
    render(<TaskFollowers task={task({})} currentEmail={null} onChange={vi.fn()} />);
    expect(screen.getByTestId('task-follow')).toBeDisabled();
  });
});
