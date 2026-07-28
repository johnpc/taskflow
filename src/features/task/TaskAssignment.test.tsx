import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskAssignment } from './TaskAssignment';
import type { SectionRecord, TaskRecord } from '../../lib/dataClient';

const sections: SectionRecord[] = [
  { id: 's1', name: 'To do' } as SectionRecord,
  { id: 's2', name: 'Done' } as SectionRecord,
];
const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', sectionId: 's1', assigneeEmail: null, ...over }) as TaskRecord;

describe('TaskAssignment', () => {
  it('moves the task to another section', () => {
    const onMove = vi.fn();
    render(
      <TaskAssignment
        task={task({})}
        sections={sections}
        currentEmail="me@x.co"
        onMove={onMove}
        onAssign={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByTestId('task-section-select'), { target: { value: 's2' } });
    expect(onMove).toHaveBeenCalledWith('s2');
  });

  it('assigns to the current user when unassigned', () => {
    const onAssign = vi.fn();
    render(
      <TaskAssignment
        task={task({})}
        sections={sections}
        currentEmail="me@x.co"
        onMove={vi.fn()}
        onAssign={onAssign}
      />,
    );
    fireEvent.click(screen.getByTestId('task-assign'));
    expect(onAssign).toHaveBeenCalledWith('me@x.co');
  });

  it('unassigns when already assigned', () => {
    const onAssign = vi.fn();
    render(
      <TaskAssignment
        task={task({ assigneeEmail: 'me@x.co' })}
        sections={sections}
        currentEmail="me@x.co"
        onMove={vi.fn()}
        onAssign={onAssign}
      />,
    );
    expect(screen.getByTestId('task-assign')).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByTestId('task-assign'));
    expect(onAssign).toHaveBeenCalledWith(null);
  });
});
