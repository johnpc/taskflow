import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SectionMoveButtons } from './SectionMoveButtons';

describe('SectionMoveButtons', () => {
  it('reports left and right moves', () => {
    const onMove = vi.fn();
    render(<SectionMoveButtons name="To do" onMove={onMove} />);
    fireEvent.click(screen.getByTestId('section-move-left'));
    expect(onMove).toHaveBeenCalledWith('left');
    fireEvent.click(screen.getByTestId('section-move-right'));
    expect(onMove).toHaveBeenCalledWith('right');
  });
});
