import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';

vi.mock('./useProjectMembers', () => ({
  useProjectMembers: () => ({ busy: false, add: vi.fn(), remove: vi.fn() }),
}));

import { renderWithProviders } from '../../test/renderWithProviders';
import { ProjectShareRegion } from './ProjectShareRegion';

describe('ProjectShareRegion', () => {
  it('renders the members UI when there are members', () => {
    renderWithProviders(<ProjectShareRegion projectId="p" members={['owner@x.co']} />);
    expect(screen.getByTestId('project-members')).toBeInTheDocument();
  });

  it('renders nothing before members load', () => {
    renderWithProviders(<ProjectShareRegion projectId="p" members={[]} />);
    expect(screen.queryByTestId('project-members')).not.toBeInTheDocument();
  });
});
