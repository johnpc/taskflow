import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskActions } from './TaskActions';

describe('TaskActions', () => {
  it('fires duplicate and disables while duplicating', () => {
    const onDuplicate = vi.fn();
    const { rerender } = render(
      <TaskActions duplicating={false} onDuplicate={onDuplicate} onDelete={vi.fn()} />,
    );
    fireEvent.click(screen.getByTestId('task-duplicate'));
    expect(onDuplicate).toHaveBeenCalled();
    rerender(<TaskActions duplicating onDuplicate={onDuplicate} onDelete={vi.fn()} />);
    expect(screen.getByTestId('task-duplicate')).toBeDisabled();
  });

  it('renders the delete control', () => {
    render(<TaskActions duplicating={false} onDuplicate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByTestId('task-delete')).toBeInTheDocument();
  });
});
