import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

const { push, replace } = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }));
vi.mock('react-router-dom', () => ({ useHistory: () => ({ push, replace }) }));

import { useTaskDetailNav } from './useTaskDetailNav';
import type { TaskRecord } from '../../lib/dataClient';
import type { TaskDetailHook } from './useTaskDetail';

const task = { id: 't', projectId: 'p' } as TaskRecord;

// A hook stub whose mutations synchronously invoke their onSuccess callback.
function stub(overrides: Partial<Record<string, unknown>> = {}): TaskDetailHook {
  return {
    remove: { mutate: (_id: string, o?: { onSuccess?: () => void }) => o?.onSuccess?.() },
    duplicate: {
      mutate: (_t: TaskRecord, o?: { onSuccess?: (c: TaskRecord) => void }) =>
        o?.onSuccess?.({ id: 'copy' } as TaskRecord),
    },
    ...overrides,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

describe('useTaskDetailNav', () => {
  it('deletes then returns to the project board', () => {
    const { result } = renderHook(() => useTaskDetailNav(task, stub()));
    result.current.deleteTask();
    expect(replace).toHaveBeenCalledWith('/projects/p');
  });

  it('duplicates then opens the copy', () => {
    const { result } = renderHook(() => useTaskDetailNav(task, stub()));
    result.current.duplicateTask();
    expect(push).toHaveBeenCalledWith('/tasks/copy');
  });

  it('opens a task by id', () => {
    const { result } = renderHook(() => useTaskDetailNav(task, stub()));
    result.current.openTask('x');
    expect(push).toHaveBeenCalledWith('/tasks/x');
  });
});
