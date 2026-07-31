import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// MemberAvatar self-fetches its display via useProfileDisplay — stub it so this
// stays a bare render; echo initials from the email's first two letters.
const { useProfileDisplay } = vi.hoisted(() => ({ useProfileDisplay: vi.fn() }));
vi.mock('../profile/useProfileDisplay', () => ({ useProfileDisplay }));

import { MemberAvatars } from './MemberAvatars';

beforeEach(() =>
  useProfileDisplay.mockImplementation((email: string) => ({
    label: email,
    initials: (email ?? '').slice(0, 2).toUpperCase(),
  })),
);

describe('MemberAvatars', () => {
  it('renders nothing for a solo or empty project', () => {
    const { container: solo } = render(<MemberAvatars members={['owner@x.co']} />);
    expect(solo).toBeEmptyDOMElement();
    const { container: none } = render(<MemberAvatars members={[]} />);
    expect(none).toBeEmptyDOMElement();
  });

  it('shows one avatar per member', () => {
    render(<MemberAvatars members={['ada@x.co', 'grace@x.co']} />);
    expect(screen.getAllByTestId('member-avatar')).toHaveLength(2);
  });

  it('caps the stack and shows a "+N" overflow chip', () => {
    render(<MemberAvatars members={['a@x.co', 'b@x.co', 'c@x.co', 'd@x.co', 'e@x.co']} max={3} />);
    expect(screen.getAllByTestId('member-avatar')).toHaveLength(3);
    expect(screen.getByTestId('member-avatar-more')).toHaveTextContent('+2');
  });
});
