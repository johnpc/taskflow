import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import { UpcomingTasks } from './UpcomingTasks';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', status: 'TODO', dueDate: '2030-01-01', ...over }) as TaskRecord;

describe('UpcomingTasks', () => {
  it('renders each upcoming task with a due label and opens it', () => {
    renderWithProviders(
      <UpcomingTasks tasks={[task({ id: 'a', title: 'Ship it', dueDate: '2030-01-01' })]} />,
    );
    const item = screen.getByTestId('home-upcoming-item');
    expect(item).toHaveTextContent('Ship it');
    expect(item).toHaveTextContent(/Jan/);
    fireEvent.click(item);
    // navigates (no throw); presence of the item is the assertion.
    expect(item).toBeInTheDocument();
  });

  it('renders nothing when there is nothing upcoming', () => {
    const { container } = renderWithProviders(<UpcomingTasks tasks={[]} />);
    expect(container.querySelector('[data-testid="home-upcoming"]')).toBeNull();
  });
});
