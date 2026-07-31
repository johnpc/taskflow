import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const { useDisplayName } = vi.hoisted(() => ({ useDisplayName: vi.fn() }));
vi.mock('./useDisplayName', () => ({ useDisplayName }));

import { DisplayNameField } from './DisplayNameField';

const setDraft = vi.fn();
const mutate = vi.fn();
beforeEach(() => {
  setDraft.mockReset();
  mutate.mockReset();
  useDisplayName.mockReturnValue({
    draft: '',
    setDraft,
    save: { mutate, isPending: false, isSuccess: false },
    saved: null,
  });
});

describe('DisplayNameField', () => {
  it('disables Save until the name is dirty and non-empty', () => {
    render(<DisplayNameField />);
    expect(screen.getByTestId('display-name-save')).toBeDisabled();
  });

  it('saves a changed name', () => {
    useDisplayName.mockReturnValue({
      draft: 'Ada',
      setDraft,
      save: { mutate, isPending: false, isSuccess: false },
      saved: null,
    });
    render(<DisplayNameField />);
    const save = screen.getByTestId('display-name-save');
    expect(save).toBeEnabled();
    fireEvent.click(save);
    expect(mutate).toHaveBeenCalledWith('Ada');
  });

  it('edits the draft on input', () => {
    render(<DisplayNameField />);
    fireEvent.change(screen.getByTestId('display-name-input'), { target: { value: 'Grace' } });
    expect(setDraft).toHaveBeenCalledWith('Grace');
  });
});
