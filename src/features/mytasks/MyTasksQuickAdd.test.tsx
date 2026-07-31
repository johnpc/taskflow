import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MyTasksQuickAdd } from './MyTasksQuickAdd';
import type { ProjectRecord } from '../../lib/dataClient';

const projects = [
  { id: 'p1', name: 'Alpha' },
  { id: 'p2', name: 'Beta' },
] as ProjectRecord[];

describe('MyTasksQuickAdd', () => {
  it('renders nothing without projects', () => {
    const { container } = render(<MyTasksQuickAdd projects={[]} onAdd={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('adds to the first project by default on Enter', () => {
    const onAdd = vi.fn();
    render(<MyTasksQuickAdd projects={projects} onAdd={onAdd} />);
    const input = screen.getByTestId('quickadd-title');
    fireEvent.change(input, { target: { value: 'Buy milk' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onAdd).toHaveBeenCalledWith({ projectId: 'p1', title: 'Buy milk' });
  });

  it('adds to the chosen project via the Add button', () => {
    const onAdd = vi.fn();
    render(<MyTasksQuickAdd projects={projects} onAdd={onAdd} />);
    fireEvent.change(screen.getByTestId('quickadd-project'), { target: { value: 'p2' } });
    fireEvent.change(screen.getByTestId('quickadd-title'), { target: { value: 'Ship it' } });
    fireEvent.click(screen.getByTestId('quickadd-add'));
    expect(onAdd).toHaveBeenCalledWith({ projectId: 'p2', title: 'Ship it' });
  });

  it('disables Add for a blank title', () => {
    render(<MyTasksQuickAdd projects={projects} onAdd={vi.fn()} />);
    expect(screen.getByTestId('quickadd-add')).toBeDisabled();
  });
});
