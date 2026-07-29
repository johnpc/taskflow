import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectPicker } from './ProjectPicker';
import type { ProjectRecord, TaskRecord } from '../../lib/dataClient';

const projects = [
  { id: 'p1', name: 'Launch' },
  { id: 'p2', name: 'Website' },
] as ProjectRecord[];

describe('ProjectPicker', () => {
  it('reflects the current project and moves on a different pick', () => {
    const onMove = vi.fn();
    const task = { id: 't', projectId: 'p1' } as TaskRecord;
    render(<ProjectPicker task={task} projects={projects} onMove={onMove} />);
    const select = screen.getByTestId('task-project-select');
    expect(select).toHaveValue('p1');
    fireEvent.change(select, { target: { value: 'p2' } });
    expect(onMove).toHaveBeenCalledWith('p2');
  });

  it('does not fire when re-selecting the same project', () => {
    const onMove = vi.fn();
    const task = { id: 't', projectId: 'p1' } as TaskRecord;
    render(<ProjectPicker task={task} projects={projects} onMove={onMove} />);
    fireEvent.change(screen.getByTestId('task-project-select'), { target: { value: 'p1' } });
    expect(onMove).not.toHaveBeenCalled();
  });
});
