import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskLabels } from './TaskLabels';
import type { LabelRecord, TaskRecord } from '../../lib/dataClient';

const reg: LabelRecord[] = [
  { id: 'a', name: 'Marketing', color: 'rose' } as LabelRecord,
  { id: 'b', name: 'Design', color: 'violet' } as LabelRecord,
];
const task = (labelIds: string[]): TaskRecord => ({ id: 't', title: 'T', labelIds }) as TaskRecord;

describe('TaskLabels', () => {
  it('patches labelIds by toggling a label on', () => {
    const onPatch = vi.fn();
    render(
      <TaskLabels task={task([])} registry={reg} onPatchLabels={onPatch} onCreateLabel={vi.fn()} />,
    );
    fireEvent.click(screen.getAllByTestId('label-option')[0]);
    expect(onPatch).toHaveBeenCalledWith(['a']);
  });

  it('patches labelIds by toggling a label off', () => {
    const onPatch = vi.fn();
    render(
      <TaskLabels
        task={task(['a'])}
        registry={reg}
        onPatchLabels={onPatch}
        onCreateLabel={vi.fn()}
      />,
    );
    fireEvent.click(screen.getAllByTestId('label-option')[0]);
    expect(onPatch).toHaveBeenCalledWith([]);
  });
});
