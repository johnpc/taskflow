import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';

const { useSearch } = vi.hoisted(() => ({ useSearch: vi.fn() }));
vi.mock('./useSearch', () => ({ useSearch }));

import { renderWithProviders } from '../../test/renderWithProviders';
import { Search } from './Search';

beforeEach(() => useSearch.mockReset());

describe('Search', () => {
  it('prompts when the query is blank', () => {
    useSearch.mockReturnValue({ query: '', setQuery: vi.fn(), results: [] });
    renderWithProviders(<Search />);
    expect(screen.getByTestId('search-prompt')).toBeInTheDocument();
  });

  it('shows no-match empty state', () => {
    useSearch.mockReturnValue({ query: 'zzz', setQuery: vi.fn(), results: [] });
    renderWithProviders(<Search />);
    expect(screen.getByTestId('search-empty')).toBeInTheDocument();
  });

  it('lists results', () => {
    useSearch.mockReturnValue({
      query: 'ship',
      setQuery: vi.fn(),
      results: [{ id: 't', title: 'Ship it' }],
    });
    renderWithProviders(<Search />);
    expect(screen.getByTestId('search-results')).toBeInTheDocument();
    expect(screen.getByText('Ship it')).toBeInTheDocument();
  });
});
