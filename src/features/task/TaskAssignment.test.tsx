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

  it('assigns to a chosen member', () => {
    const onAssign = vi.fn();
    render(
      <TaskAssignment
        task={task({ members: ['owner@x.co', 'alice@x.co'] })}
        sections={sections}
        currentEmail="owner@x.co"
        onMove={vi.fn()}
        onAssign={onAssign}
      />,
    );
    fireEvent.change(screen.getByTestId('task-assignee-select'), {
      target: { value: 'alice@x.co' },
    });
    expect(onAssign).toHaveBeenCalledWith('alice@x.co');
  });

  it('unassigns when Unassigned is chosen', () => {
    const onAssign = vi.fn();
    render(
      <TaskAssignment
        task={task({ assigneeEmail: 'me@x.co', members: ['me@x.co'] })}
        sections={sections}
        currentEmail="me@x.co"
        onMove={vi.fn()}
        onAssign={onAssign}
      />,
    );
    const select = screen.getByTestId('task-assignee-select') as HTMLSelectElement;
    expect(select.value).toBe('me@x.co');
    fireEvent.change(select, { target: { value: '' } });
    expect(onAssign).toHaveBeenCalledWith(null);
  });

  it('ensures the current user is assignable in a solo project', () => {
    render(
      <TaskAssignment
        task={task({ members: [] })}
        sections={sections}
        currentEmail="me@x.co"
        onMove={vi.fn()}
        onAssign={vi.fn()}
      />,
    );
    expect(screen.getByRole('option', { name: 'me@x.co' })).toBeInTheDocument();
  });
});
