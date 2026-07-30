import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const { changePassword } = vi.hoisted(() => ({ changePassword: vi.fn() }));
vi.mock('../auth/authClient', () => ({ changePassword }));

import { ChangePassword } from './ChangePassword';

beforeEach(() => changePassword.mockReset().mockResolvedValue({ ok: true }));

describe('ChangePassword', () => {
  it('submits the entered passwords and confirms on success', async () => {
    render(<ChangePassword />);
    fireEvent.change(screen.getByTestId('cp-current'), { target: { value: 'oldpass1' } });
    fireEvent.change(screen.getByTestId('cp-new'), { target: { value: 'newpass123' } });
    fireEvent.click(screen.getByTestId('cp-save'));
    await waitFor(() => expect(screen.getByTestId('cp-done')).toBeInTheDocument());
    expect(changePassword).toHaveBeenCalledWith('oldpass1', 'newpass123');
  });
});
