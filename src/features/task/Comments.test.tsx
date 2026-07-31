import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Comments } from './Comments';
import type { CommentRecord } from '../../lib/dataClient';

const comment = (over: Partial<CommentRecord>): CommentRecord =>
  ({ id: 'c', body: 'Hello', authorEmail: 'a@b.co', ...over }) as CommentRecord;

const renderComments = (over: Partial<Parameters<typeof Comments>[0]> = {}) =>
  render(
    <Comments
      comments={[]}
      busy={false}
      nowMs={0}
      currentEmail="me@x.co"
      onPost={vi.fn()}
      onEdit={vi.fn()}
      onDelete={vi.fn()}
      onLike={vi.fn()}
      {...over}
    />,
  );

describe('Comments', () => {
  it('renders existing comments', () => {
    renderComments({ comments: [comment({ body: 'First' })] });
    expect(screen.getByText('First')).toBeInTheDocument();
  });

  it('disables post when the draft is empty', () => {
    renderComments();
    expect(screen.getByTestId('comment-post')).toBeDisabled();
  });

  it('posts a trimmed comment and clears the draft', () => {
    const onPost = vi.fn();
    renderComments({ onPost });
    const input = screen.getByTestId('comment-input');
    fireEvent.change(input, { target: { value: 'Nice work' } });
    fireEvent.click(screen.getByTestId('comment-post'));
    expect(onPost).toHaveBeenCalledWith('Nice work');
    expect(input).toHaveValue('');
  });

  it('deletes a comment via its delete button', () => {
    const onDelete = vi.fn();
    renderComments({ comments: [comment({ id: 'c9' })], onDelete });
    fireEvent.click(screen.getByTestId('comment-delete'));
    expect(onDelete).toHaveBeenCalledWith('c9');
  });

  it('likes a comment via its like button', () => {
    const onLike = vi.fn();
    const c = comment({ id: 'c3' });
    renderComments({ comments: [c], onLike });
    fireEvent.click(screen.getByTestId('comment-like'));
    expect(onLike).toHaveBeenCalledWith(c);
  });
});
