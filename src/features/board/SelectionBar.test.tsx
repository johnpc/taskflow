import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectionBar } from './SelectionBar';

describe('SelectionBar', () => {
  it('shows the count and fires each action', () => {
    const onComplete = vi.fn();
    const onDelete = vi.fn();
    const onClear = vi.fn();
    render(
      <SelectionBar count={3} onComplete={onComplete} onDelete={onDelete} onClear={onClear} />,
    );
    expect(screen.getByTestId('selection-bar')).toHaveTextContent('3 selected');
    fireEvent.click(screen.getByTestId('bulk-complete'));
    fireEvent.click(screen.getByTestId('bulk-delete'));
    fireEvent.click(screen.getByTestId('bulk-clear'));
    expect(onComplete).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledOnce();
    expect(onClear).toHaveBeenCalledOnce();
  });
});
