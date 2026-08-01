import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import { TodayTasks } from './TodayTasks';
import type { TaskRecord } from '../../lib/dataClient';

describe('TodayTasks', () => {
  it('renders nothing when nothing is due today', () => {
    const { container } = renderWithProviders(<TodayTasks tasks={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('lists today’s tasks with a heading', () => {
    const tasks = [{ id: 't1', title: 'Ship it' }] as TaskRecord[];
    renderWithProviders(<TodayTasks tasks={tasks} />);
    expect(screen.getByText('Due today')).toBeInTheDocument();
    expect(screen.getByTestId('home-today-item')).toHaveTextContent('Ship it');
  });
});
