import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { HomeSummaryCards } from './HomeSummaryCards';
import { renderWithProviders } from '../../test/renderWithProviders';
import type { HomeSummary } from './homeSummary';
import type { TaskRecord } from '../../lib/dataClient';

const summary = (over: Partial<HomeSummary>): HomeSummary =>
  ({ today: [], overdue: 0, upcoming: [], ...over }) as HomeSummary;

describe('HomeSummaryCards', () => {
  it('shows today + overdue counts', () => {
    renderWithProviders(
      <HomeSummaryCards summary={summary({ today: [{ id: 't' } as TaskRecord], overdue: 3 })} />,
    );
    expect(screen.getByTestId('home-today')).toHaveTextContent('1');
    expect(screen.getByTestId('home-overdue')).toHaveTextContent('3');
  });

  it('flags overdue as an alert only when there are overdue tasks', () => {
    const { rerender } = renderWithProviders(
      <HomeSummaryCards summary={summary({ overdue: 2 })} />,
    );
    expect(screen.getByTestId('home-overdue').className).toContain('home__stat--alert');
    rerender(<HomeSummaryCards summary={summary({ overdue: 0 })} />);
    expect(screen.getByTestId('home-overdue').className).not.toContain('home__stat--alert');
  });
});
