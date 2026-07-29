import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CommentRow } from './CommentRow';
import type { CommentRecord } from '../../lib/dataClient';

const comment = (over: Partial<CommentRecord>): CommentRecord =>
  ({ id: 'c', body: 'Hello', authorEmail: 'a@b.co', ...over }) as CommentRecord;

describe('CommentRow', () => {
  it('shows the body with edit + delete actions', () => {
    render(<CommentRow comment={comment({})} nowMs={0} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByTestId('comment-edit')).toBeInTheDocument();
    expect(screen.getByTestId('comment-delete')).toBeInTheDocument();
  });

  it('shows a relative timestamp from createdAt', () => {
    const now = Date.parse('2026-07-29T12:00:00Z');
    render(
      <CommentRow
        comment={comment({ createdAt: '2026-07-29T11:58:00Z' })}
        nowMs={now}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByTestId('comment-time')).toHaveTextContent('2m ago');
  });

  it('edits and saves a changed body', () => {
    const onEdit = vi.fn();
    render(
      <CommentRow comment={comment({ id: 'c9' })} nowMs={0} onEdit={onEdit} onDelete={vi.fn()} />,
    );
    fireEvent.click(screen.getByTestId('comment-edit'));
    fireEvent.change(screen.getByTestId('comment-edit-input'), { target: { value: 'Updated' } });
    fireEvent.click(screen.getByTestId('comment-edit-save'));
    expect(onEdit).toHaveBeenCalledWith({ id: 'c9', body: 'Updated' });
  });

  it('does not fire onEdit when the body is unchanged', () => {
    const onEdit = vi.fn();
    render(
      <CommentRow
        comment={comment({ body: 'Same' })}
        nowMs={0}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId('comment-edit'));
    fireEvent.click(screen.getByTestId('comment-edit-save'));
    expect(onEdit).not.toHaveBeenCalled();
  });

  it('cancels an edit without saving', () => {
    const onEdit = vi.fn();
    render(<CommentRow comment={comment({})} nowMs={0} onEdit={onEdit} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByTestId('comment-edit'));
    fireEvent.change(screen.getByTestId('comment-edit-input'), { target: { value: 'X' } });
    fireEvent.click(screen.getByTestId('comment-edit-cancel'));
    expect(onEdit).not.toHaveBeenCalled();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('deletes via the delete button', () => {
    const onDelete = vi.fn();
    render(
      <CommentRow comment={comment({ id: 'c7' })} nowMs={0} onEdit={vi.fn()} onDelete={onDelete} />,
    );
    fireEvent.click(screen.getByTestId('comment-delete'));
    expect(onDelete).toHaveBeenCalledWith('c7');
  });
});
