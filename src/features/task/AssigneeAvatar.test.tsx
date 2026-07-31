import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const { useProfileDisplay } = vi.hoisted(() => ({ useProfileDisplay: vi.fn() }));
vi.mock('../profile/useProfileDisplay', () => ({ useProfileDisplay }));

import { AssigneeAvatar } from './AssigneeAvatar';

beforeEach(() => useProfileDisplay.mockReset());

describe('AssigneeAvatar', () => {
  it('shows the resolved initials with the label as its aria-label', () => {
    useProfileDisplay.mockReturnValue({ label: 'Ada Lovelace', initials: 'AL' });
    render(<AssigneeAvatar email="ada.lovelace@x.co" />);
    const avatar = screen.getByTestId('task-assignee-avatar');
    expect(avatar).toHaveTextContent('AL');
    expect(avatar).toHaveAttribute('aria-label', 'Assigned to Ada Lovelace');
  });

  it('renders nothing when unassigned', () => {
    useProfileDisplay.mockReturnValue({ label: '', initials: '' });
    const { container } = render(<AssigneeAvatar email={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
