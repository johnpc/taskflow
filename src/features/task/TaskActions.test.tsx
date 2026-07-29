import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskActions } from './TaskActions';

describe('TaskActions', () => {
  it('fires duplicate and disables while duplicating', () => {
    const onDuplicate = vi.fn();
    const { rerender } = render(
      <TaskActions taskId="t" duplicating={false} onDuplicate={onDuplicate} onDelete={vi.fn()} />,
    );
    fireEvent.click(screen.getByTestId('task-duplicate'));
    expect(onDuplicate).toHaveBeenCalled();
    rerender(<TaskActions taskId="t" duplicating onDuplicate={onDuplicate} onDelete={vi.fn()} />);
    expect(screen.getByTestId('task-duplicate')).toBeDisabled();
  });

  it('renders the copy-link and delete controls', () => {
    render(<TaskActions taskId="t" duplicating={false} onDuplicate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByTestId('task-copy-link')).toBeInTheDocument();
    expect(screen.getByTestId('task-delete')).toBeInTheDocument();
  });
});
