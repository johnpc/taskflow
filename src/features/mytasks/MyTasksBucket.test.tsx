import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { MyTasksBucket } from './MyTasksBucket';
import { renderWithProviders } from '../../test/renderWithProviders';
import type { TaskBucket } from './groupByDue';
import type { TaskRecord } from '../../lib/dataClient';

const bucket: TaskBucket = {
  key: 'TODAY',
  label: 'Today',
  tasks: [
    {
      id: 't1',
      title: 'Ship it',
      status: 'TODO',
      myBucket: 'TODAY',
      projectId: 'p1',
    } as TaskRecord,
  ],
};

const projectsById = new Map([['p1', { name: 'Launch', color: 'sky' }]]);

describe('MyTasksBucket', () => {
  it('renders the bucket header, count, and cards', () => {
    renderWithProviders(
      <MyTasksBucket
        bucket={bucket}
        showFocusPicker={false}
        projectsById={projectsById}
        onToggleDone={vi.fn()}
        onSetBucket={vi.fn()}
      />,
    );
    expect(screen.getByTestId('bucket-TODAY')).toHaveTextContent('Today');
    expect(screen.getByText('Ship it')).toBeInTheDocument();
    expect(screen.getByTestId('task-project')).toHaveTextContent('Launch');
    expect(screen.queryByTestId('focus-bucket-select')).not.toBeInTheDocument();
  });

  it('shows a focus picker per card in focus mode and re-files a task', () => {
    const onSetBucket = vi.fn();
    renderWithProviders(
      <MyTasksBucket
        bucket={bucket}
        showFocusPicker
        projectsById={projectsById}
        onToggleDone={vi.fn()}
        onSetBucket={onSetBucket}
      />,
    );
    fireEvent.change(screen.getByTestId('focus-bucket-select'), { target: { value: 'LATER' } });
    expect(onSetBucket).toHaveBeenCalledWith({ id: 't1', myBucket: 'LATER' });
  });
});
