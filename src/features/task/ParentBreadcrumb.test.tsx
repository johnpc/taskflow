import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const { useParentTask } = vi.hoisted(() => ({ useParentTask: vi.fn() }));
vi.mock('./useParentTask', () => ({ useParentTask }));

import { ParentBreadcrumb } from './ParentBreadcrumb';

beforeEach(() => useParentTask.mockReset());

describe('ParentBreadcrumb', () => {
  it('renders nothing for a top-level task', () => {
    useParentTask.mockReturnValue({ data: null });
    const { container } = render(<ParentBreadcrumb parentTaskId={null} onOpen={vi.fn()} />);
    expect(container.querySelector('[data-testid="task-parent-crumb"]')).toBeNull();
  });

  it('shows the parent title and opens it on click', () => {
    const onOpen = vi.fn();
    useParentTask.mockReturnValue({ data: { id: 'p', title: 'Parent task' } });
    render(<ParentBreadcrumb parentTaskId="p" onOpen={onOpen} />);
    expect(screen.getByText('Parent task')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('task-parent-crumb'));
    expect(onOpen).toHaveBeenCalledWith('p');
  });

  it('falls back to a generic label while the parent loads', () => {
    useParentTask.mockReturnValue({ data: undefined });
    render(<ParentBreadcrumb parentTaskId="p" onOpen={vi.fn()} />);
    expect(screen.getByText('Parent task')).toBeInTheDocument();
  });

  it('promotes the subtask when the promote button is clicked', () => {
    const onPromote = vi.fn();
    useParentTask.mockReturnValue({ data: { id: 'p', title: 'Parent task' } });
    render(<ParentBreadcrumb parentTaskId="p" onOpen={vi.fn()} onPromote={onPromote} />);
    fireEvent.click(screen.getByTestId('task-promote'));
    expect(onPromote).toHaveBeenCalled();
  });

  it('hides the promote button when no handler is given', () => {
    useParentTask.mockReturnValue({ data: { id: 'p', title: 'Parent task' } });
    render(<ParentBreadcrumb parentTaskId="p" onOpen={vi.fn()} />);
    expect(screen.queryByTestId('task-promote')).toBeNull();
  });
});
