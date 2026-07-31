import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const { useTaskCover } = vi.hoisted(() => ({ useTaskCover: vi.fn() }));
vi.mock('./useTaskCover', () => ({ useTaskCover }));

import { CoverUpload } from './CoverUpload';
import type { TaskRecord } from '../../lib/dataClient';

const mutate = vi.fn();
const task = { id: 't1', coverKey: null } as TaskRecord;
beforeEach(() => {
  mutate.mockReset();
  useTaskCover.mockReturnValue({ url: null, upload: { mutate, isPending: false } });
});

describe('CoverUpload', () => {
  it('offers to add a cover when none is set', () => {
    render(<CoverUpload task={task} />);
    expect(screen.getByTestId('cover-pick')).toHaveTextContent('Add a cover image');
    expect(screen.queryByTestId('cover-preview')).toBeNull();
  });

  it('previews + offers to replace an existing cover', () => {
    useTaskCover.mockReturnValue({ url: 'https://s3/c', upload: { mutate, isPending: false } });
    render(<CoverUpload task={task} />);
    expect(screen.getByTestId('cover-preview')).toHaveAttribute('src', 'https://s3/c');
    expect(screen.getByTestId('cover-pick')).toHaveTextContent('Replace cover');
  });

  it('uploads a picked file', () => {
    render(<CoverUpload task={task} />);
    const file = new File(['x'], 'pic.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('cover-file'), { target: { files: [file] } });
    expect(mutate).toHaveBeenCalledWith(file);
  });
});
