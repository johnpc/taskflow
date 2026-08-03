import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';
import { renderWithProviders } from '../../test/renderWithProviders';
import type { ProjectRecord } from '../../lib/dataClient';

const project = (over: Partial<ProjectRecord>): ProjectRecord =>
  ({ id: 'p', name: 'Launch', color: 'sky', favorite: false, ...over }) as ProjectRecord;

describe('ProjectCard', () => {
  it('renders the name and links to the project', () => {
    renderWithProviders(<ProjectCard project={project({})} onToggleFavorite={vi.fn()} />);
    expect(screen.getByText('Launch')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/projects/p');
  });

  it('shows a progress bar with a done-of-total label', () => {
    renderWithProviders(
      <ProjectCard
        project={project({})}
        progress={{ done: 3, total: 4 }}
        onToggleFavorite={vi.fn()}
      />,
    );
    expect(screen.getByTestId('project-progress-label')).toHaveTextContent('3 of 4 done');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });

  it('shows a "No tasks yet" progress row when the project has no tasks', () => {
    // The progress region always renders (even at 0 tasks) so every project row
    // is a uniform height — an empty project reads "No tasks yet" with an empty
    // bar rather than collapsing to a shorter, jagged row.
    renderWithProviders(
      <ProjectCard
        project={project({})}
        progress={{ done: 0, total: 0 }}
        onToggleFavorite={vi.fn()}
      />,
    );
    expect(screen.getByTestId('project-progress')).toBeInTheDocument();
    expect(screen.getByTestId('project-progress-label')).toHaveTextContent('No tasks yet');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('renders the progress region even when progress is undefined', () => {
    renderWithProviders(<ProjectCard project={project({})} onToggleFavorite={vi.fn()} />);
    expect(screen.getByTestId('project-progress-label')).toHaveTextContent('No tasks yet');
  });

  it('reflects favorite state', () => {
    renderWithProviders(
      <ProjectCard project={project({ favorite: true })} onToggleFavorite={vi.fn()} />,
    );
    expect(screen.getByTestId('project-fav')).toHaveAttribute('aria-pressed', 'true');
  });

  it('fires the favorite toggle', () => {
    const onToggle = vi.fn();
    renderWithProviders(<ProjectCard project={project({})} onToggleFavorite={onToggle} />);
    fireEvent.click(screen.getByTestId('project-fav'));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('hides the count badge when zero', () => {
    renderWithProviders(<ProjectCard project={project({})} count={0} onToggleFavorite={vi.fn()} />);
    expect(screen.queryByTestId('project-count')).not.toBeInTheDocument();
  });

  it('shows an open-task count badge when non-zero', () => {
    renderWithProviders(<ProjectCard project={project({})} count={4} onToggleFavorite={vi.fn()} />);
    expect(screen.getByTestId('project-count')).toHaveTextContent('4');
  });
});
