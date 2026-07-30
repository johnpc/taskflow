import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectTopBar } from './ProjectTopBar';
import type { ProjectRecord } from '../../lib/dataClient';

const bar = (over: Partial<ProjectRecord>, props: Record<string, unknown> = {}) =>
  render(
    <ProjectTopBar
      project={{ id: 'p', name: 'Launch', ...over } as ProjectRecord}
      onToggleFavorite={vi.fn()}
      onDuplicate={vi.fn()}
      onArchive={vi.fn()}
      onDelete={vi.fn()}
      {...props}
    />,
  );

describe('ProjectTopBar', () => {
  it('shows the project name', () => {
    bar({});
    expect(screen.getByTestId('project-title')).toHaveTextContent('Launch');
  });

  it('reflects the favorite state and toggles it', () => {
    const onToggleFavorite = vi.fn();
    bar({ favorite: true }, { onToggleFavorite });
    const star = screen.getByTestId('project-favorite');
    expect(star).toHaveAttribute('aria-label', 'Unfavorite project');
    fireEvent.click(star);
    expect(onToggleFavorite).toHaveBeenCalledOnce();
  });

  it('labels an unfavorited project as "Favorite project"', () => {
    bar({ favorite: false });
    expect(screen.getByTestId('project-favorite')).toHaveAttribute(
      'aria-label',
      'Favorite project',
    );
  });
});
