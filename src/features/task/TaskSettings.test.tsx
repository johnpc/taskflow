import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskSettings } from './TaskSettings';
import type { ProjectRecord, SectionRecord, TaskRecord } from '../../lib/dataClient';

const task = { id: 't', projectId: 'p1', repeat: 'NONE', isMilestone: false } as TaskRecord;
const sections = [{ id: 's1', name: 'To do', sortOrder: 0 }] as SectionRecord[];
const projects = [
  { id: 'p1', name: 'A' },
  { id: 'p2', name: 'B' },
] as ProjectRecord[];

describe('TaskSettings', () => {
  it('moves to another project via onMoveProject', () => {
    const onMoveProject = vi.fn();
    render(
      <TaskSettings
        task={task}
        sections={sections}
        projects={projects}
        currentEmail="me@x.co"
        onPatch={vi.fn()}
        onMoveProject={onMoveProject}
      />,
    );
    fireEvent.change(screen.getByTestId('task-project-select'), { target: { value: 'p2' } });
    expect(onMoveProject).toHaveBeenCalledWith('p2');
  });

  it('patches the repeat rule via onPatch', () => {
    const onPatch = vi.fn();
    render(
      <TaskSettings
        task={task}
        sections={sections}
        projects={projects}
        currentEmail={null}
        onPatch={onPatch}
        onMoveProject={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByTestId('task-repeat-select'), { target: { value: 'WEEKLY' } });
    expect(onPatch).toHaveBeenCalledWith({ repeat: 'WEEKLY' });
  });

  it('patches a highlight color via onPatch', () => {
    const onPatch = vi.fn();
    render(
      <TaskSettings
        task={task}
        sections={sections}
        projects={projects}
        currentEmail={null}
        onPatch={onPatch}
        onMoveProject={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId('task-color-sky'));
    expect(onPatch).toHaveBeenCalledWith({ color: 'sky' });
  });
});
