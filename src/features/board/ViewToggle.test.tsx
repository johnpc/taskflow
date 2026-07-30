import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ViewToggle } from './ViewToggle';

describe('ViewToggle', () => {
  it('marks the active mode pressed', () => {
    render(<ViewToggle mode="LIST" onChange={vi.fn()} />);
    expect(screen.getByTestId('view-list')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('view-board')).toHaveAttribute('aria-pressed', 'false');
  });

  it('reports a mode change', () => {
    const onChange = vi.fn();
    render(<ViewToggle mode="LIST" onChange={onChange} />);
    fireEvent.click(screen.getByTestId('view-board'));
    expect(onChange).toHaveBeenCalledWith('BOARD');
  });

  it('offers and selects the Timeline view', () => {
    const onChange = vi.fn();
    render(<ViewToggle mode="TIMELINE" onChange={onChange} />);
    expect(screen.getByTestId('view-timeline')).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByTestId('view-list'));
    expect(onChange).toHaveBeenCalledWith('LIST');
  });
});
