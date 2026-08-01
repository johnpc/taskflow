import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProjectSection } from './ProjectSection';
import type { ProjectRecord } from '../../lib/dataClient';

const p = (id: string, name: string): ProjectRecord =>
  ({ id, name, color: 'indigo' }) as ProjectRecord;

const renderSection = (projects: ProjectRecord[]) =>
  render(
    <MemoryRouter>
      <ProjectSection
        label="Starred"
        testid="projects-starred"
        projects={projects}
        counts={new Map()}
        progress={new Map()}
        onToggleFavorite={vi.fn()}
      />
    </MemoryRouter>,
  );

describe('ProjectSection', () => {
  it('renders a labeled group of cards', () => {
    renderSection([p('a', 'Launch'), p('b', 'Website')]);
    expect(screen.getByTestId('projects-starred')).toHaveTextContent('Starred');
    expect(screen.getByText('Launch')).toBeInTheDocument();
    expect(screen.getByText('Website')).toBeInTheDocument();
  });

  it('renders nothing when empty', () => {
    renderSection([]);
    expect(screen.queryByTestId('projects-starred')).not.toBeInTheDocument();
  });
});
