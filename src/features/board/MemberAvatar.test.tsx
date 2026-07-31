import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const { useProfileDisplay } = vi.hoisted(() => ({ useProfileDisplay: vi.fn() }));
vi.mock('../profile/useProfileDisplay', () => ({ useProfileDisplay }));

import { MemberAvatar } from './MemberAvatar';

beforeEach(() => useProfileDisplay.mockReset());

describe('MemberAvatar', () => {
  it('shows the resolved initials with the label as its tooltip', () => {
    useProfileDisplay.mockReturnValue({ label: 'Ada Lovelace', initials: 'AL' });
    render(<MemberAvatar email="ada@x.co" />);
    const avatar = screen.getByTestId('member-avatar');
    expect(avatar).toHaveTextContent('AL');
    expect(avatar).toHaveAttribute('title', 'Ada Lovelace');
  });
});
