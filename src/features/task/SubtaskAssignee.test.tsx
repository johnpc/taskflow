import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// AssigneeAvatar self-fetches (react-query) — stub it for these bare renders.
vi.mock('./AssigneeAvatar', () => ({
  AssigneeAvatar: ({ email }: { email: string | null }) => <span>{email ?? ''}</span>,
}));

import { SubtaskAssignee } from './SubtaskAssignee';

describe('SubtaskAssignee', () => {
  it('renders read-only avatar without onAssign/members', () => {
    render(<SubtaskAssignee assigneeEmail="a@x.co" />);
    expect(screen.queryByTestId('subtask-assignee-edit')).not.toBeInTheDocument();
  });

  it('shows an editable select with members when onAssign is given', () => {
    render(<SubtaskAssignee assigneeEmail={null} members={['a@x.co']} onAssign={vi.fn()} />);
    expect(screen.getByTestId('subtask-assignee-edit')).toBeInTheDocument();
    expect(screen.getByLabelText('Assign subtask')).toHaveValue('');
  });

  it('emits the picked assignee, and null when unassigned', () => {
    const onAssign = vi.fn();
    render(
      <SubtaskAssignee assigneeEmail="a@x.co" members={['a@x.co', 'b@x.co']} onAssign={onAssign} />,
    );
    const select = screen.getByLabelText('Assign subtask');
    fireEvent.change(select, { target: { value: 'b@x.co' } });
    expect(onAssign).toHaveBeenCalledWith('b@x.co');
    fireEvent.change(select, { target: { value: '' } });
    expect(onAssign).toHaveBeenCalledWith(null);
  });
});
