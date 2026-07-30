import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusPill } from './StatusPill';

describe('StatusPill', () => {
  it('renders the label for a set status', () => {
    render(<StatusPill status="OFF_TRACK" />);
    const pill = screen.getByTestId('status-pill');
    expect(pill).toHaveTextContent('Off track');
    expect(pill).toHaveAttribute('data-status', 'OFF_TRACK');
  });

  it('renders nothing without a status', () => {
    const { container } = render(<StatusPill status={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
