import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MilestoneToggle } from './MilestoneToggle';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', isMilestone: false, ...over }) as TaskRecord;

describe('MilestoneToggle', () => {
  it('reflects the off state and turns it on', () => {
    const onToggle = vi.fn();
    render(<MilestoneToggle task={task({})} onToggle={onToggle} />);
    const btn = screen.getByTestId('task-milestone-toggle');
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(btn);
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('reflects the on state and turns it off', () => {
    const onToggle = vi.fn();
    render(<MilestoneToggle task={task({ isMilestone: true })} onToggle={onToggle} />);
    const btn = screen.getByTestId('task-milestone-toggle');
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(btn);
    expect(onToggle).toHaveBeenCalledWith(false);
  });
});
