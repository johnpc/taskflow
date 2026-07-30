import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AssigneeAvatar } from './AssigneeAvatar';

describe('AssigneeAvatar', () => {
  it('shows the assignee initials with the email as its label', () => {
    render(<AssigneeAvatar email="ada.lovelace@x.co" />);
    const avatar = screen.getByTestId('task-assignee-avatar');
    expect(avatar).toHaveTextContent('AL');
    expect(avatar).toHaveAttribute('aria-label', 'Assigned to ada.lovelace@x.co');
  });

  it('renders nothing when unassigned', () => {
    const { container } = render(<AssigneeAvatar email={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
