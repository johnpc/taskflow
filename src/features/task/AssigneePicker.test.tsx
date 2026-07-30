import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AssigneePicker } from './AssigneePicker';

describe('AssigneePicker', () => {
  it('lists Unassigned + each member and reflects the value', () => {
    render(
      <AssigneePicker
        assigneeEmail="alice@x.co"
        members={['owner@x.co', 'alice@x.co']}
        onAssign={vi.fn()}
      />,
    );
    const select = screen.getByTestId('task-assignee-select') as HTMLSelectElement;
    expect(select.value).toBe('alice@x.co');
    expect(screen.getByRole('option', { name: 'Unassigned' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'owner@x.co' })).toBeInTheDocument();
  });

  it('reports a new assignee and unassign', () => {
    const onAssign = vi.fn();
    render(<AssigneePicker assigneeEmail={null} members={['owner@x.co']} onAssign={onAssign} />);
    const select = screen.getByTestId('task-assignee-select');
    fireEvent.change(select, { target: { value: 'owner@x.co' } });
    expect(onAssign).toHaveBeenCalledWith('owner@x.co');
    fireEvent.change(select, { target: { value: '' } });
    expect(onAssign).toHaveBeenCalledWith(null);
  });

  it('keeps a stale assignee visible even if no longer a member', () => {
    render(
      <AssigneePicker assigneeEmail="gone@x.co" members={['owner@x.co']} onAssign={vi.fn()} />,
    );
    expect(screen.getByRole('option', { name: 'gone@x.co' })).toBeInTheDocument();
  });
});
