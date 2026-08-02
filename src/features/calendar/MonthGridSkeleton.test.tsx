import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MonthGridSkeleton } from './MonthGridSkeleton';

describe('MonthGridSkeleton', () => {
  it('renders a weekday header + a full grid of placeholder cells', () => {
    render(<MonthGridSkeleton />);
    expect(screen.getByTestId('calendar-grid-skeleton')).toBeInTheDocument();
    expect(screen.getByText('Sun')).toBeInTheDocument();
    // 7 weekday headers + 35 placeholder cells.
    expect(document.querySelectorAll('.calendar-cell--skeleton')).toHaveLength(35);
  });
});
