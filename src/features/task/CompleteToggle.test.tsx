import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CompleteToggle } from './CompleteToggle';
import type { TaskRecord } from '../../lib/dataClient';

const task = { id: 't', title: 'Ship it', status: 'TODO' } as TaskRecord;

describe('CompleteToggle', () => {
  it('fires onToggle when clicked', () => {
    const onToggle = vi.fn();
    render(<CompleteToggle task={task} done={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByTestId('task-check'));
    expect(onToggle).toHaveBeenCalled();
  });

  it('shows the hover-preview hint only when not done', () => {
    const { rerender, container } = render(
      <CompleteToggle task={task} done={false} onToggle={vi.fn()} />,
    );
    expect(container.querySelector('.task-card__check-hint')).not.toBeNull();
    expect(screen.getByTestId('task-check')).toHaveAttribute('aria-pressed', 'false');
    rerender(<CompleteToggle task={task} done onToggle={vi.fn()} />);
    expect(container.querySelector('.task-card__check-hint')).toBeNull();
    expect(screen.getByTestId('task-check')).toHaveAttribute('aria-pressed', 'true');
  });
});
