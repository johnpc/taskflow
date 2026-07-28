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
});
