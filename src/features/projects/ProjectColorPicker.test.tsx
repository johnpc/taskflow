import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectColorPicker } from './ProjectColorPicker';

describe('ProjectColorPicker', () => {
  it('marks the active color and picks another', () => {
    const onPick = vi.fn();
    render(<ProjectColorPicker color="rose" onPick={onPick} />);
    expect(screen.getByTestId('project-color-rose')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('project-color-sky')).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(screen.getByTestId('project-color-sky'));
    expect(onPick).toHaveBeenCalledWith('sky');
  });

  it('defaults the active swatch when no color is set', () => {
    render(<ProjectColorPicker color={null} onPick={vi.fn()} />);
    expect(screen.getByTestId('project-color-indigo')).toHaveAttribute('aria-pressed', 'true');
  });
});
