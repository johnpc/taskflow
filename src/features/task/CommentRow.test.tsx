import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CommentRow } from './CommentRow';
import type { CommentRecord } from '../../lib/dataClient';

const comment = (over: Partial<CommentRecord>): CommentRecord =>
  ({ id: 'c', body: 'Hello', authorEmail: 'a@b.co', ...over }) as CommentRecord;

describe('CommentRow', () => {
  it('shows the body with edit + delete actions', () => {
    render(<CommentRow comment={comment({})} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByTestId('comment-edit')).toBeInTheDocument();
    expect(screen.getByTestId('comment-delete')).toBeInTheDocument();
  });

  it('edits and saves a changed body', () => {
    const onEdit = vi.fn();
    render(<CommentRow comment={comment({ id: 'c9' })} onEdit={onEdit} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByTestId('comment-edit'));
    fireEvent.change(screen.getByTestId('comment-edit-input'), { target: { value: 'Updated' } });
    fireEvent.click(screen.getByTestId('comment-edit-save'));
    expect(onEdit).toHaveBeenCalledWith({ id: 'c9', body: 'Updated' });
  });

  it('does not fire onEdit when the body is unchanged', () => {
    const onEdit = vi.fn();
    render(<CommentRow comment={comment({ body: 'Same' })} onEdit={onEdit} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByTestId('comment-edit'));
    fireEvent.click(screen.getByTestId('comment-edit-save'));
    expect(onEdit).not.toHaveBeenCalled();
  });

  it('cancels an edit without saving', () => {
    const onEdit = vi.fn();
    render(<CommentRow comment={comment({})} onEdit={onEdit} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByTestId('comment-edit'));
    fireEvent.change(screen.getByTestId('comment-edit-input'), { target: { value: 'X' } });
    fireEvent.click(screen.getByTestId('comment-edit-cancel'));
    expect(onEdit).not.toHaveBeenCalled();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('deletes via the delete button', () => {
    const onDelete = vi.fn();
    render(<CommentRow comment={comment({ id: 'c7' })} onEdit={vi.fn()} onDelete={onDelete} />);
    fireEvent.click(screen.getByTestId('comment-delete'));
    expect(onDelete).toHaveBeenCalledWith('c7');
  });
});
