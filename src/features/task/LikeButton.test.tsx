import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LikeButton } from './LikeButton';

describe('LikeButton', () => {
  it('shows the count and a filled heart when I have liked it', () => {
    render(
      <LikeButton likedBy={['me@x.co', 'you@x.co']} currentEmail="me@x.co" onToggle={vi.fn()} />,
    );
    expect(screen.getByTestId('task-like')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('task-like-count')).toHaveTextContent('2');
  });

  it('hides the count at zero and reads unpressed', () => {
    render(<LikeButton likedBy={[]} currentEmail="me@x.co" onToggle={vi.fn()} />);
    expect(screen.getByTestId('task-like')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.queryByTestId('task-like-count')).not.toBeInTheDocument();
  });

  it('fires onToggle on click', () => {
    const onToggle = vi.fn();
    render(<LikeButton likedBy={[]} currentEmail="me@x.co" onToggle={onToggle} />);
    fireEvent.click(screen.getByTestId('task-like'));
    expect(onToggle).toHaveBeenCalled();
  });

  it('is disabled with no current user', () => {
    render(<LikeButton likedBy={[]} currentEmail={null} onToggle={vi.fn()} />);
    expect(screen.getByTestId('task-like')).toBeDisabled();
  });
});
