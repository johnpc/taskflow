import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReorderControls } from './ReorderControls';

describe('ReorderControls', () => {
  it('reports up and down', () => {
    const onReorder = vi.fn();
    render(<ReorderControls onReorder={onReorder} />);
    fireEvent.click(screen.getByTestId('reorder-up'));
    expect(onReorder).toHaveBeenCalledWith('up');
    fireEvent.click(screen.getByTestId('reorder-down'));
    expect(onReorder).toHaveBeenCalledWith('down');
  });
});
