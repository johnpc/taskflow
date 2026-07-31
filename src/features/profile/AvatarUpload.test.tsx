import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const { useAvatar } = vi.hoisted(() => ({ useAvatar: vi.fn() }));
vi.mock('./useAvatar', () => ({ useAvatar }));

import { AvatarUpload } from './AvatarUpload';

const mutate = vi.fn();
beforeEach(() => {
  mutate.mockReset();
  useAvatar.mockReturnValue({ url: null, upload: { mutate, isPending: false } });
});

describe('AvatarUpload', () => {
  it('shows the initials fallback when no avatar is set', () => {
    render(<AvatarUpload fallback="A" />);
    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('A');
    expect(screen.queryByTestId('avatar-image')).toBeNull();
  });

  it('shows the uploaded image when set', () => {
    useAvatar.mockReturnValue({ url: 'https://s3/pic', upload: { mutate, isPending: false } });
    render(<AvatarUpload fallback="A" />);
    expect(screen.getByTestId('avatar-image')).toHaveAttribute('src', 'https://s3/pic');
  });

  it('uploads a picked file', () => {
    render(<AvatarUpload fallback="A" />);
    const file = new File(['x'], 'me.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('avatar-file'), { target: { files: [file] } });
    expect(mutate).toHaveBeenCalledWith(file);
  });
});
