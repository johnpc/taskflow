import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CommentBody } from './CommentBody';

describe('CommentBody', () => {
  it('highlights @mentions and keeps the surrounding text', () => {
    render(<CommentBody body="hey @ada look at this" />);
    const mentions = screen.getAllByTestId('comment-mention');
    expect(mentions).toHaveLength(1);
    expect(mentions[0]).toHaveTextContent('@ada');
    expect(screen.getByTestId('comment-body')).toHaveTextContent('hey @ada look at this');
  });

  it('renders plain text with no mentions', () => {
    render(<CommentBody body="just a note" />);
    expect(screen.queryByTestId('comment-mention')).toBeNull();
    expect(screen.getByTestId('comment-body')).toHaveTextContent('just a note');
  });

  it('renders **bold** and safe [links](url)', () => {
    render(<CommentBody body="see **this** and [docs](https://x.co)" />);
    expect(screen.getByText('this').tagName).toBe('STRONG');
    const link = screen.getByRole('link', { name: 'docs' });
    expect(link).toHaveAttribute('href', 'https://x.co');
  });
});
