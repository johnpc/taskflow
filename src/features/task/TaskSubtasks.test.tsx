import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('./AssigneeAvatar', () => ({ AssigneeAvatar: () => null }));

import { TaskSubtasks } from './TaskSubtasks';
import type { TaskDetailHook } from './useTaskDetail';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 'p', projectId: 'proj', title: 'Parent', members: ['me@x.co'], ...over }) as TaskRecord;

const hook = (subs: TaskRecord[], patch = vi.fn()) =>
  ({
    query: { data: { subtasks: subs } },
    patch: { mutate: patch },
    toggleDone: { mutate: vi.fn() },
    addSubtask: { mutate: vi.fn() },
  }) as unknown as TaskDetailHook;

describe('TaskSubtasks', () => {
  it('wires an inline due edit to a patch on the subtask id', () => {
    const patch = vi.fn();
    const sub = { id: 's1', title: 'Sub', dueDate: '2026-08-01' } as TaskRecord;
    render(
      <TaskSubtasks
        task={task({})}
        hook={hook([sub], patch)}
        currentEmail="me@x.co"
        onOpen={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByLabelText('Set subtask due date'), {
      target: { value: '2026-08-09' },
    });
    expect(patch).toHaveBeenCalledWith({ id: 's1', dueDate: '2026-08-09' });
  });

  it('wires an inline assignee edit to a patch on the subtask id', () => {
    const patch = vi.fn();
    const sub = { id: 's2', title: 'Sub2' } as TaskRecord;
    render(
      <TaskSubtasks
        task={task({})}
        hook={hook([sub], patch)}
        currentEmail="me@x.co"
        onOpen={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByLabelText('Assign subtask'), { target: { value: 'me@x.co' } });
    expect(patch).toHaveBeenCalledWith({ id: 's2', assigneeEmail: 'me@x.co' });
  });
});
