import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../board/MemberAvatar', () => ({ MemberAvatar: () => null }));

import { TaskSocial } from './TaskSocial';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', ...over }) as TaskRecord;

describe('TaskSocial', () => {
  it('renders the like + follow controls', () => {
    render(<TaskSocial task={task({})} currentEmail="me@x.co" onPatch={vi.fn()} />);
    expect(screen.getByTestId('task-like')).toBeInTheDocument();
    expect(screen.getByTestId('task-follow')).toBeInTheDocument();
  });

  it('patches likedBy when the heart is toggled', () => {
    const onPatch = vi.fn();
    render(<TaskSocial task={task({ likedBy: [] })} currentEmail="me@x.co" onPatch={onPatch} />);
    fireEvent.click(screen.getByTestId('task-like'));
    expect(onPatch).toHaveBeenCalledWith({ likedBy: ['me@x.co'] });
  });

  it('patches followers when follow is toggled', () => {
    const onPatch = vi.fn();
    render(<TaskSocial task={task({ followers: [] })} currentEmail="me@x.co" onPatch={onPatch} />);
    fireEvent.click(screen.getByTestId('task-follow'));
    expect(onPatch).toHaveBeenCalledWith({ followers: ['me@x.co'] });
  });
});
