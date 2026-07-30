import { describe, it, expect } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { CelebrationProvider } from './CelebrationProvider';
import { useCelebration } from './useCelebration';

function Trigger() {
  const { celebrate } = useCelebration();
  return (
    <button data-testid="go" onClick={celebrate}>
      complete
    </button>
  );
}

describe('CelebrationProvider', () => {
  it('bursts on the first completion and not the second', () => {
    render(
      <CelebrationProvider>
        <Trigger />
      </CelebrationProvider>,
    );
    expect(screen.queryByTestId('confetti')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('go')); // count 1 → celebrate
    expect(screen.getByTestId('confetti')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('go')); // count 2 → no new burst
    // still the first burst visible (or cleared); count 2 must not itself qualify
    expect(screen.getAllByTestId('confetti').length).toBeLessThanOrEqual(1);
  });

  it('provides a no-op celebrate outside a provider (no throw)', () => {
    render(<Trigger />);
    act(() => {
      fireEvent.click(screen.getByTestId('go'));
    });
    expect(screen.queryByTestId('confetti')).not.toBeInTheDocument();
  });
});
