import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CommentRow } from './CommentRow';
import type { CommentRecord } from '../../lib/dataClient';

const comment = (over: Partial<CommentRecord>): CommentRecord =>
  ({ id: 'c', body: 'Hello', authorEmail: 'a@b.co', ...over }) as CommentRecord;

// All required props with test-overridable defaults, so a test only states what
// it cares about (currentEmail + onLike were added for comment likes).
const renderRow = (over: Partial<Parameters<typeof CommentRow>[0]> = {}) =>
  render(
    <CommentRow
      comment={comment({})}
      nowMs={0}
      currentEmail="me@x.co"
      onEdit={vi.fn()}
      onDelete={vi.fn()}
      onLike={vi.fn()}
      {...over}
    />,
  );

describe('CommentRow', () => {
  it('shows the body with like + edit + delete actions', () => {
    renderRow();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByTestId('comment-like')).toBeInTheDocument();
    expect(screen.getByTestId('comment-edit')).toBeInTheDocument();
    expect(screen.getByTestId('comment-delete')).toBeInTheDocument();
  });

  it('shows a relative timestamp from createdAt', () => {
    const now = Date.parse('2026-07-29T12:00:00Z');
    renderRow({ comment: comment({ createdAt: '2026-07-29T11:58:00Z' }), nowMs: now });
    expect(screen.getByTestId('comment-time')).toHaveTextContent('2m ago');
  });

  it('edits and saves a changed body', () => {
    const onEdit = vi.fn();
    renderRow({ comment: comment({ id: 'c9' }), onEdit });
    fireEvent.click(screen.getByTestId('comment-edit'));
    fireEvent.change(screen.getByTestId('comment-edit-input'), { target: { value: 'Updated' } });
    fireEvent.click(screen.getByTestId('comment-edit-save'));
    expect(onEdit).toHaveBeenCalledWith({ id: 'c9', body: 'Updated' });
  });

  it('does not fire onEdit when the body is unchanged', () => {
    const onEdit = vi.fn();
    renderRow({ comment: comment({ body: 'Same' }), onEdit });
    fireEvent.click(screen.getByTestId('comment-edit'));
    fireEvent.click(screen.getByTestId('comment-edit-save'));
    expect(onEdit).not.toHaveBeenCalled();
  });

  it('cancels an edit without saving', () => {
    const onEdit = vi.fn();
    renderRow({ onEdit });
    fireEvent.click(screen.getByTestId('comment-edit'));
    fireEvent.change(screen.getByTestId('comment-edit-input'), { target: { value: 'X' } });
    fireEvent.click(screen.getByTestId('comment-edit-cancel'));
    expect(onEdit).not.toHaveBeenCalled();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('deletes via the delete button', () => {
    const onDelete = vi.fn();
    renderRow({ comment: comment({ id: 'c7' }), onDelete });
    fireEvent.click(screen.getByTestId('comment-delete'));
    expect(onDelete).toHaveBeenCalledWith('c7');
  });

  it('likes via the like button and shows a filled heart + count when liked', () => {
    const onLike = vi.fn();
    const liked = comment({ id: 'c5', likedBy: ['me@x.co', 'you@x.co'] });
    renderRow({ comment: liked, onLike });
    expect(screen.getByTestId('comment-like')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('comment-like-count')).toHaveTextContent('2');
    fireEvent.click(screen.getByTestId('comment-like'));
    expect(onLike).toHaveBeenCalledWith(liked);
  });

  it('disables the like button when signed-out', () => {
    renderRow({ currentEmail: null });
    expect(screen.getByTestId('comment-like')).toBeDisabled();
  });
});
