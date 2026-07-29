import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { ProjectHeader } from './ProjectHeader';
import { renderWithProviders } from '../../test/renderWithProviders';
import type { ProjectRecord } from '../../lib/dataClient';

const project = (over: Partial<ProjectRecord>): ProjectRecord =>
  ({ id: 'p', name: 'Launch', description: '', ...over }) as ProjectRecord;

describe('ProjectHeader', () => {
  it('commits a changed description on blur', () => {
    const onDescribe = vi.fn();
    renderWithProviders(
      <ProjectHeader project={project({})} onDescribe={onDescribe} onAddSection={vi.fn()} />,
    );
    const input = screen.getByTestId('project-description');
    fireEvent.change(input, { target: { value: 'Q3 launch plan' } });
    fireEvent.blur(input);
    expect(onDescribe).toHaveBeenCalledWith('Q3 launch plan');
  });

  it('does not commit an unchanged description', () => {
    const onDescribe = vi.fn();
    renderWithProviders(
      <ProjectHeader
        project={project({ description: 'same' })}
        onDescribe={onDescribe}
        onAddSection={vi.fn()}
      />,
    );
    fireEvent.blur(screen.getByTestId('project-description'));
    expect(onDescribe).not.toHaveBeenCalled();
  });

  it('adds a section on Enter', () => {
    const onAddSection = vi.fn();
    renderWithProviders(
      <ProjectHeader project={project({})} onDescribe={vi.fn()} onAddSection={onAddSection} />,
    );
    const input = screen.getByTestId('add-section-input');
    fireEvent.change(input, { target: { value: 'Review' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onAddSection).toHaveBeenCalledWith('Review');
  });

  it('links to the completed view', () => {
    renderWithProviders(
      <ProjectHeader project={project({})} onDescribe={vi.fn()} onAddSection={vi.fn()} />,
    );
    expect(screen.getByTestId('completed-link')).toHaveAttribute('href', '/projects/p/completed');
  });
});
