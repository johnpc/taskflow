import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BlockerPicker } from './BlockerPicker';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', projectId: 'p', ...over }) as TaskRecord;

describe('BlockerPicker', () => {
  it('shows an empty note when there are no other tasks', () => {
    render(
      <BlockerPicker
        task={task({ id: 't' })}
        candidates={[task({ id: 't' })]}
        onToggle={vi.fn()}
      />,
    );
    expect(screen.getByText(/No other tasks/)).toBeInTheDocument();
  });

  it('marks selected + done blockers and toggles on click', () => {
    const onToggle = vi.fn();
    const t = task({ id: 't', blockedByIds: ['a'] });
    const candidates = [
      t,
      task({ id: 'a', title: 'A', status: 'DONE' }),
      task({ id: 'b', title: 'B' }),
    ];
    render(<BlockerPicker task={t} candidates={candidates} onToggle={onToggle} />);
    const opts = screen.getAllByTestId('blocker-option');
    expect(opts).toHaveLength(2);
    const a = screen.getByText('A');
    expect(a).toHaveAttribute('aria-pressed', 'true');
    expect(a.className).toContain('deps-opt--done');
    fireEvent.click(screen.getByText('B'));
    expect(onToggle).toHaveBeenCalledWith('b');
  });
});
