import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Comments } from './Comments';
import type { CommentRecord } from '../../lib/dataClient';

const comment = (over: Partial<CommentRecord>): CommentRecord =>
  ({ id: 'c', body: 'Hello', authorEmail: 'a@b.co', ...over }) as CommentRecord;

describe('Comments', () => {
  it('renders existing comments', () => {
    render(<Comments comments={[comment({ body: 'First' })]} busy={false} onPost={vi.fn()} />);
    expect(screen.getByText('First')).toBeInTheDocument();
  });

  it('disables post when the draft is empty', () => {
    render(<Comments comments={[]} busy={false} onPost={vi.fn()} />);
    expect(screen.getByTestId('comment-post')).toBeDisabled();
  });

  it('posts a trimmed comment and clears the draft', () => {
    const onPost = vi.fn();
    render(<Comments comments={[]} busy={false} onPost={onPost} />);
    const input = screen.getByTestId('comment-input');
    fireEvent.change(input, { target: { value: 'Nice work' } });
    fireEvent.click(screen.getByTestId('comment-post'));
    expect(onPost).toHaveBeenCalledWith('Nice work');
    expect(input).toHaveValue('');
  });
});
