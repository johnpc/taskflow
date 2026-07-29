import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const { useProjectTasks } = vi.hoisted(() => ({ useProjectTasks: vi.fn() }));
vi.mock('./useProjectTasks', () => ({ useProjectTasks }));

import { TaskDependencies } from './TaskDependencies';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', projectId: 'p', ...over }) as TaskRecord;

beforeEach(() => useProjectTasks.mockReset());

describe('TaskDependencies', () => {
  it('shows the blocked banner naming open blockers and patches on toggle', () => {
    const onPatch = vi.fn();
    const t = task({ id: 't', blockedByIds: ['a'] });
    useProjectTasks.mockReturnValue({
      data: [t, task({ id: 'a', title: 'Design', status: 'TODO' })],
    });
    render(<TaskDependencies task={t} onPatch={onPatch} />);
    expect(screen.getByTestId('blocked-banner')).toHaveTextContent('Blocked by Design');
    fireEvent.click(screen.getByText('Design'));
    expect(onPatch).toHaveBeenCalledWith([]);
  });

  it('hides the banner when every blocker is done', () => {
    const t = task({ id: 't', blockedByIds: ['a'] });
    useProjectTasks.mockReturnValue({
      data: [t, task({ id: 'a', title: 'Design', status: 'DONE' })],
    });
    render(<TaskDependencies task={t} onPatch={vi.fn()} />);
    expect(screen.queryByTestId('blocked-banner')).not.toBeInTheDocument();
  });
});
