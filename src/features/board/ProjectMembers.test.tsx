import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectMembers } from './ProjectMembers';

describe('ProjectMembers', () => {
  it('lists members, marking the first as owner (no remove)', () => {
    render(
      <ProjectMembers members={['owner@x.co', 'alice@x.co']} onAdd={vi.fn()} onRemove={vi.fn()} />,
    );
    expect(screen.getByText('owner@x.co')).toBeInTheDocument();
    expect(screen.getByText('Owner')).toBeInTheDocument();
    // Only the non-owner row has a remove button.
    expect(screen.getAllByTestId('member-remove')).toHaveLength(1);
  });

  it('invites a valid email and clears the input', () => {
    const onAdd = vi.fn();
    render(<ProjectMembers members={['owner@x.co']} onAdd={onAdd} onRemove={vi.fn()} />);
    const input = screen.getByTestId('member-email') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'bob@x.co' } });
    fireEvent.click(screen.getByTestId('member-invite'));
    expect(onAdd).toHaveBeenCalledWith('bob@x.co');
    expect(input.value).toBe('');
  });

  it('disables invite for an invalid email', () => {
    render(<ProjectMembers members={['owner@x.co']} onAdd={vi.fn()} onRemove={vi.fn()} />);
    fireEvent.change(screen.getByTestId('member-email'), { target: { value: 'nope' } });
    expect(screen.getByTestId('member-invite')).toBeDisabled();
  });

  it('removes a member', () => {
    const onRemove = vi.fn();
    render(
      <ProjectMembers members={['owner@x.co', 'alice@x.co']} onAdd={vi.fn()} onRemove={onRemove} />,
    );
    fireEvent.click(screen.getByTestId('member-remove'));
    expect(onRemove).toHaveBeenCalledWith('alice@x.co');
  });
});
