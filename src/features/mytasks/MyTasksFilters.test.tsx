import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MyTasksFilters } from './MyTasksFilters';

const props = {
  showCompleted: false,
  onShowCompleted: vi.fn(),
  assignedOnly: false,
  onAssignedOnly: vi.fn(),
  followingOnly: false,
  onFollowingOnly: vi.fn(),
};

describe('MyTasksFilters', () => {
  it('renders the three toggles reflecting their state', () => {
    render(<MyTasksFilters {...props} followingOnly />);
    expect(screen.getByTestId('mytasks-show-completed')).not.toBeChecked();
    expect(screen.getByTestId('mytasks-assigned-only')).not.toBeChecked();
    expect(screen.getByTestId('mytasks-following-only')).toBeChecked();
  });

  it('delegates each toggle', () => {
    const onFollowingOnly = vi.fn();
    render(<MyTasksFilters {...props} onFollowingOnly={onFollowingOnly} />);
    fireEvent.click(screen.getByTestId('mytasks-following-only'));
    expect(onFollowingOnly).toHaveBeenCalledWith(true);
  });
});
