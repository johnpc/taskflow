import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';

const { useTaskDetail } = vi.hoisted(() => ({ useTaskDetail: vi.fn() }));
vi.mock('./useTaskDetail', () => ({ useTaskDetail }));

import { renderWithProviders } from '../../test/renderWithProviders';
import { TaskDetail } from './TaskDetail';

const mutations = {
  patch: { mutate: vi.fn() },
  toggleDone: { mutate: vi.fn() },
  addSubtask: { mutate: vi.fn() },
  comment: { mutate: vi.fn(), isPending: false },
};

beforeEach(() => useTaskDetail.mockReset());

describe('TaskDetail', () => {
  it('renders the task when loaded', () => {
    useTaskDetail.mockReturnValue({
      query: {
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
        data: {
          task: {
            id: 't',
            title: 'Write spec',
            projectId: 'p',
            status: 'TODO',
            priority: 'NONE',
            dueDate: null,
            notes: null,
          },
          subtasks: [],
          comments: [],
        },
      },
      ...mutations,
    });
    renderWithProviders(<TaskDetail />, '/tasks/t');
    expect(screen.getByTestId('task-detail')).toBeInTheDocument();
    expect(screen.getByTestId('task-title')).toHaveValue('Write spec');
  });

  it('shows the not-found empty state', () => {
    useTaskDetail.mockReturnValue({
      query: {
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
        data: { task: null, subtasks: [], comments: [] },
      },
      ...mutations,
    });
    renderWithProviders(<TaskDetail />, '/tasks/gone');
    expect(screen.getByTestId('load-empty')).toBeInTheDocument();
  });

  it('wires priority patch, subtask add, and comment post', () => {
    const patch = { mutate: vi.fn() };
    const addSubtask = { mutate: vi.fn() };
    const comment = { mutate: vi.fn(), isPending: false };
    const toggleDone = { mutate: vi.fn() };
    useTaskDetail.mockReturnValue({
      query: {
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
        data: {
          task: {
            id: 't',
            title: 'T',
            projectId: 'p',
            status: 'TODO',
            priority: 'NONE',
            dueDate: null,
            notes: null,
          },
          subtasks: [{ id: 's', title: 'Sub', status: 'TODO', sortOrder: 0 }],
          comments: [],
        },
      },
      patch,
      addSubtask,
      comment,
      toggleDone,
    });
    renderWithProviders(<TaskDetail />, '/tasks/t');

    fireEvent.click(screen.getByTestId('priority-high'));
    expect(patch.mutate).toHaveBeenCalledWith(
      expect.objectContaining({ id: 't', priority: 'HIGH' }),
    );

    fireEvent.click(screen.getByTestId('task-detail-check'));
    expect(toggleDone.mutate).toHaveBeenCalledWith(
      expect.objectContaining({ taskId: 't', done: true }),
    );

    const commentInput = screen.getByTestId('comment-input');
    fireEvent.change(commentInput, { target: { value: 'looks good' } });
    fireEvent.click(screen.getByTestId('comment-post'));
    expect(comment.mutate).toHaveBeenCalledWith('looks good');
  });
});
