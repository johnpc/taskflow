import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeGate } from './ThemeGate';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders three segments with system selected by default', () => {
    render(<ThemeToggle />);
    expect(screen.getByTestId('theme-system')).toHaveAttribute('aria-pressed', 'true');
  });

  it('selects dark on click', () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByTestId('theme-dark'));
    expect(screen.getByTestId('theme-dark')).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});

describe('ThemeGate', () => {
  it('renders its children', () => {
    render(
      <ThemeGate>
        <span>inside</span>
      </ThemeGate>,
    );
    expect(screen.getByText('inside')).toBeInTheDocument();
  });
});
