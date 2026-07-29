import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DuePresetButtons } from './DuePresetButtons';

describe('DuePresetButtons', () => {
  it('renders the three presets and picks a date', () => {
    const onPick = vi.fn();
    render(<DuePresetButtons onPick={onPick} />);
    expect(screen.getByTestId('due-preset-today')).toBeInTheDocument();
    expect(screen.getByTestId('due-preset-tomorrow')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('due-preset-nextWeek'));
    // Picks a YYYY-MM-DD date (the actual value depends on today).
    expect(onPick).toHaveBeenCalledWith(expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/));
  });
});
