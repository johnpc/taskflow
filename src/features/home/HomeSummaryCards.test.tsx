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

  it('renders the upcoming list', () => {
    renderWithProviders(
      <HomeSummaryCards
        summary={summary({ upcoming: [{ id: 't', title: 'Ship it' } as TaskRecord] })}
      />,
    );
    expect(screen.getByTestId('home-upcoming')).toBeInTheDocument();
    expect(screen.getByText('Ship it')).toBeInTheDocument();
  });
});
