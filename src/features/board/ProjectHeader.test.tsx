import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { ProjectHeader } from './ProjectHeader';
import { renderWithProviders } from '../../test/renderWithProviders';
import type { ProjectRecord } from '../../lib/dataClient';

const project = (over: Partial<ProjectRecord>): ProjectRecord =>
  ({ id: 'p', name: 'Launch', description: '', ...over }) as ProjectRecord;

const render = (over: Partial<ProjectRecord>, props: Record<string, unknown> = {}) =>
  renderWithProviders(
    <ProjectHeader
      project={project(over)}
      onDescribe={vi.fn()}
      onSetStatus={vi.fn()}
      onAddSection={vi.fn()}
      {...props}
    />,
  );

describe('ProjectHeader', () => {
  it('commits a changed description on blur', () => {
    const onDescribe = vi.fn();
    render({}, { onDescribe });
    const input = screen.getByTestId('project-description');
    fireEvent.change(input, { target: { value: 'Q3 launch plan' } });
    fireEvent.blur(input);
    expect(onDescribe).toHaveBeenCalledWith('Q3 launch plan');
  });

  it('does not commit an unchanged description', () => {
    const onDescribe = vi.fn();
    render({ description: 'same' }, { onDescribe });
    fireEvent.blur(screen.getByTestId('project-description'));
    expect(onDescribe).not.toHaveBeenCalled();
  });

  it('adds a section on Enter', () => {
    const onAddSection = vi.fn();
    render({}, { onAddSection });
    const input = screen.getByTestId('add-section-input');
    fireEvent.change(input, { target: { value: 'Review' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onAddSection).toHaveBeenCalledWith('Review');
  });

  it('links to the completed view', () => {
    render({});
    expect(screen.getByTestId('completed-link')).toHaveAttribute('href', '/projects/p/completed');
  });

  it('sets a status when a picker button is clicked', () => {
    const onSetStatus = vi.fn();
    render({}, { onSetStatus });
    fireEvent.click(screen.getByTestId('status-set-AT_RISK'));
    expect(onSetStatus).toHaveBeenCalledWith({ status: 'AT_RISK' });
  });

  it('shows the pill and the note when a status is set', () => {
    render({ status: 'ON_TRACK', statusNote: 'Shipping Friday' });
    expect(screen.getByTestId('status-pill')).toHaveTextContent('On track');
    expect(screen.getByTestId('status-note-text')).toHaveTextContent('Shipping Friday');
  });
});
