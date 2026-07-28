import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';

const { useProjects, useCreateProject, useToggleFavorite } = vi.hoisted(() => ({
  useProjects: vi.fn(),
  useCreateProject: vi.fn(),
  useToggleFavorite: vi.fn(),
}));
vi.mock('./useProjects', () => ({ useProjects, useCreateProject, useToggleFavorite }));

import { renderWithProviders } from '../../test/renderWithProviders';
import { Projects } from './Projects';

beforeEach(() => {
  useCreateProject.mockReturnValue({ mutate: vi.fn(), isPending: false });
  useToggleFavorite.mockReturnValue({ mutate: vi.fn() });
});

describe('Projects', () => {
  it('renders the project list', () => {
    useProjects.mockReturnValue({
      data: [{ id: 'p1', name: 'Website', color: 'indigo', favorite: false }],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    renderWithProviders(<Projects />);
    expect(screen.getByText('Website')).toBeInTheDocument();
  });

  it('shows the empty state when there are no projects', () => {
    useProjects.mockReturnValue({ data: [], isLoading: false, isError: false, refetch: vi.fn() });
    renderWithProviders(<Projects />);
    expect(screen.getByTestId('load-empty')).toBeInTheDocument();
  });

  it('shows a loading skeleton', () => {
    useProjects.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });
    renderWithProviders(<Projects />);
    expect(screen.getByTestId('load-loading')).toBeInTheDocument();
  });
});
