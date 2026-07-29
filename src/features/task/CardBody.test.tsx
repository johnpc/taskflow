import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { CardBody } from './CardBody';
import { renderWithProviders } from '../../test/renderWithProviders';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({
    id: 't',
    title: 'Write spec',
    status: 'TODO',
    priority: 'NONE',
    dueDate: null,
    ...over,
  }) as TaskRecord;

describe('CardBody', () => {
  it('renders the title and an open control', () => {
    renderWithProviders(<CardBody task={task({})} labels={[]} />);
    expect(screen.getByText('Write spec')).toBeInTheDocument();
    expect(screen.getByTestId('task-open')).toBeInTheDocument();
  });

  it('shows the project chip when a project is given', () => {
    renderWithProviders(
      <CardBody task={task({})} labels={[]} project={{ name: 'Launch', color: 'sky' }} />,
    );
    expect(screen.getByTestId('task-project')).toHaveTextContent('Launch');
  });
});
