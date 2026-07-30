import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemberAvatars } from './MemberAvatars';

describe('MemberAvatars', () => {
  it('renders nothing for a solo or empty project', () => {
    const { container: solo } = render(<MemberAvatars members={['owner@x.co']} />);
    expect(solo).toBeEmptyDOMElement();
    const { container: none } = render(<MemberAvatars members={[]} />);
    expect(none).toBeEmptyDOMElement();
  });

  it('shows one initials avatar per member', () => {
    render(<MemberAvatars members={['ada.lovelace@x.co', 'grace@x.co']} />);
    const avatars = screen.getAllByTestId('member-avatar');
    expect(avatars).toHaveLength(2);
    expect(avatars[0]).toHaveTextContent('AL');
    expect(avatars[1]).toHaveTextContent('GR');
  });

  it('caps the stack and shows a "+N" overflow chip', () => {
    render(<MemberAvatars members={['a@x.co', 'b@x.co', 'c@x.co', 'd@x.co', 'e@x.co']} max={3} />);
    expect(screen.getAllByTestId('member-avatar')).toHaveLength(3);
    expect(screen.getByTestId('member-avatar-more')).toHaveTextContent('+2');
  });
});
