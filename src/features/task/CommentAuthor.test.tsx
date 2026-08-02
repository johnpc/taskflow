import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CommentAuthor } from './CommentAuthor';

describe('CommentAuthor', () => {
  it('shows the email + derived initials avatar', () => {
    render(<CommentAuthor email="ada.lovelace@x.co" />);
    expect(screen.getByText('ada.lovelace@x.co')).toBeInTheDocument();
    expect(screen.getByText('AL')).toBeInTheDocument();
  });

  it('falls back to "You" when the author email is absent', () => {
    render(<CommentAuthor email={null} />);
    expect(screen.getByText('You')).toBeInTheDocument();
    // Initials fall back to the first letter of "You".
    expect(screen.getByText('Y')).toBeInTheDocument();
  });
});
