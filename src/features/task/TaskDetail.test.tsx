import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';

const { useTaskDetail } = vi.hoisted(() => ({ useTaskDetail: vi.fn() }));
vi.mock('./useTaskDetail', () => ({ useTaskDetail }));
// The loaded-task body is covered by its own test; here we only exercise the
// load-gate shell, so stub the body to a marker.
vi.mock('./TaskDetailBody', () => ({
  TaskDetailBody: () => <div data-testid="task-detail" />,
}));

import { renderWithProviders } from '../../test/renderWithProviders';
import { TaskDetail } from './TaskDetail';

beforeEach(() => useTaskDetail.mockReset());

describe('TaskDetail', () => {
  it('renders the body when the task loads', () => {
    useTaskDetail.mockReturnValue({
      query: {
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
        data: { task: { id: 't', title: 'Write spec' }, subtasks: [], comments: [] },
      },
    });
    renderWithProviders(<TaskDetail />, '/tasks/t');
    expect(screen.getByTestId('task-detail')).toBeInTheDocument();
    // The task title is echoed in the toolbar so it stays in view on scroll.
    expect(screen.getByTestId('task-detail-toolbar-title')).toHaveTextContent('Write spec');
  });

  it('shows the not-found empty state', () => {
    useTaskDetail.mockReturnValue({
      query: { isLoading: false, isError: false, refetch: vi.fn(), data: { task: null } },
    });
    renderWithProviders(<TaskDetail />, '/tasks/gone');
    expect(screen.getByTestId('load-empty')).toBeInTheDocument();
  });

  it('shows a loading skeleton', () => {
    useTaskDetail.mockReturnValue({
      query: { isLoading: true, isError: false, refetch: vi.fn(), data: undefined },
    });
    renderWithProviders(<TaskDetail />, '/tasks/t');
    expect(screen.getByTestId('load-loading')).toBeInTheDocument();
  });
});
