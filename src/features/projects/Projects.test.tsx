import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';

const { useProjects, useCreateProject, useToggleFavorite, useProjectCounts, useTemplates } =
  vi.hoisted(() => ({
    useProjects: vi.fn(),
    useCreateProject: vi.fn(),
    useToggleFavorite: vi.fn(),
    useProjectCounts: vi.fn(),
    useTemplates: vi.fn(),
  }));
vi.mock('./useProjects', () => ({ useProjects, useCreateProject, useToggleFavorite }));
vi.mock('./useProjectCounts', () => ({ useProjectCounts }));
vi.mock('../templates/useTemplates', () => ({ useTemplates }));

import { renderWithProviders } from '../../test/renderWithProviders';
import { Projects } from './Projects';

beforeEach(() => {
  useCreateProject.mockReturnValue({ mutate: vi.fn(), isPending: false });
  useToggleFavorite.mockReturnValue({ mutate: vi.fn() });
  useProjectCounts.mockReturnValue(new Map());
  useTemplates.mockReturnValue({ mutate: vi.fn(), isPending: false });
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

  it('groups starred projects into their own section', () => {
    useProjects.mockReturnValue({
      data: [
        { id: 'p1', name: 'Starry', color: 'indigo', favorite: true },
        { id: 'p2', name: 'Plain', color: 'sky', favorite: false },
      ],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    renderWithProviders(<Projects />);
    expect(screen.getByTestId('projects-starred')).toHaveTextContent('Starry');
    expect(screen.getByTestId('projects-all')).toHaveTextContent('Plain');
    expect(screen.getByTestId('projects-all')).toHaveTextContent('All projects');
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
