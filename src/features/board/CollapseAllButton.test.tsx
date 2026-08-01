import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CollapseAllButton } from './CollapseAllButton';
import { readCollapsed } from './sectionCollapse';

describe('CollapseAllButton', () => {
  beforeEach(() => localStorage.clear());

  it('renders nothing without sections', () => {
    const { container } = render(<CollapseAllButton sectionIds={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('toggles all sections and flips its label', () => {
    render(<CollapseAllButton sectionIds={['a', 'b']} />);
    const btn = screen.getByTestId('collapse-all');
    expect(btn).toHaveTextContent('Collapse all');
    expect(btn).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(btn);
    expect(readCollapsed('a', false)).toBe(true);
    expect(readCollapsed('b', false)).toBe(true);
    expect(btn).toHaveTextContent('Expand all');
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });
});
