import { describe, it, expect } from 'vitest';
import { fireEvent, screen, act } from '@testing-library/react';
import { ShortcutsGate } from './ShortcutsGate';
import { renderWithProviders } from '../../test/renderWithProviders';

describe('ShortcutsGate', () => {
  it('opens the help overlay on ? and closes it', () => {
    renderWithProviders(<ShortcutsGate />);
    expect(screen.queryByTestId('shortcuts-help')).not.toBeInTheDocument();
    act(() => fireEvent.keyDown(document, { key: '?' }));
    expect(screen.getByTestId('shortcuts-help')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('shortcuts-close'));
    expect(screen.queryByTestId('shortcuts-help')).not.toBeInTheDocument();
  });
});
