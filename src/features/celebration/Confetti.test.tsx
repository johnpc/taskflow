import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Confetti } from './Confetti';

describe('Confetti', () => {
  it('renders the requested number of pieces in a non-interactive overlay', () => {
    render(<Confetti count={10} />);
    const overlay = screen.getByTestId('confetti');
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
    expect(overlay.querySelectorAll('.confetti__piece')).toHaveLength(10);
  });
});
