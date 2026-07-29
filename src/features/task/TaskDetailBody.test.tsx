import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';

const { useTaskSections, useProjectTasks } = vi.hoisted(() => ({
  useTaskSections: vi.fn(),
  useProjectTasks: vi.fn(),
}));
vi.mock('./useTaskSections', () => ({ useTaskSections }));
vi.mock('./useProjectTasks', () => ({ useProjectTasks }));
vi.mock('../auth/useAuth', () => ({ useAuth: () => ({ email: 'me@x.co' }) }));

import { renderWithProviders } from '../../test/renderWithProviders';
import { TaskDetailBody } from './TaskDetailBody';
import type { TaskRecord } from '../../lib/dataClient';

const task = {
  id: 't',
  title: 'Write spec',
  projectId: 'p',
  status: 'TODO',
  priority: 'NONE',
  dueDate: null,
  notes: null,
  sectionId: 's1',
  assigneeEmail: null,
  labelIds: [],
} as unknown as TaskRecord;

function makeHook() {
  return {
    query: { data: { task, subtasks: [], comments: [], attachments: [] } },
    patch: { mutate: vi.fn() },
    toggleDone: { mutate: vi.fn() },
    addSubtask: { mutate: vi.fn() },
    comment: { mutate: vi.fn(), isPending: false },
    remove: { mutate: vi.fn() },
    labels: { query: { data: [] }, create: { mutate: vi.fn() } },
    attachments: { add: { mutate: vi.fn(), isPending: false }, remove: { mutate: vi.fn() } },
  };
}

beforeEach(() => {
  useTaskSections.mockReturnValue({
    data: [
      { id: 's1', name: 'To do' },
      { id: 's2', name: 'Done' },
    ],
  });
  useProjectTasks.mockReturnValue({ data: [task] });
});

describe('TaskDetailBody', () => {
  it('renders the task title and section picker', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderWithProviders(<TaskDetailBody task={task} hook={makeHook() as any} />, '/tasks/t');
    expect(screen.getByTestId('task-title')).toHaveValue('Write spec');
    expect(screen.getByTestId('task-section-select')).toBeInTheDocument();
  });

  it('moves the task via a patch when the section changes', () => {
    const hook = makeHook();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderWithProviders(<TaskDetailBody task={task} hook={hook as any} />, '/tasks/t');
    fireEvent.change(screen.getByTestId('task-section-select'), { target: { value: 's2' } });
    expect(hook.patch.mutate).toHaveBeenCalledWith({ id: 't', sectionId: 's2' });
  });

  it('assigns via a patch', () => {
    const hook = makeHook();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderWithProviders(<TaskDetailBody task={task} hook={hook as any} />, '/tasks/t');
    fireEvent.click(screen.getByTestId('task-assign'));
    expect(hook.patch.mutate).toHaveBeenCalledWith({ id: 't', assigneeEmail: 'me@x.co' });
  });
});
