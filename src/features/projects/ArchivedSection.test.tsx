import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';

const { useArchivedProjects, useUnarchiveProject } = vi.hoisted(() => ({
  useArchivedProjects: vi.fn(),
  useUnarchiveProject: vi.fn(),
}));
vi.mock('./useArchivedProjects', () => ({ useArchivedProjects, useUnarchiveProject }));

import { renderWithProviders } from '../../test/renderWithProviders';
import { ArchivedSection } from './ArchivedSection';

beforeEach(() => {
  useArchivedProjects.mockReset();
  useUnarchiveProject.mockReset();
  useUnarchiveProject.mockReturnValue({ mutate: vi.fn() });
});

describe('ArchivedSection', () => {
  it('renders nothing when there are no archived projects', () => {
    useArchivedProjects.mockReturnValue({ data: [] });
    const { container } = renderWithProviders(<ArchivedSection />);
    expect(container.querySelector('[data-testid="archived-section"]')).toBeNull();
  });

  it('expands to list archived projects and restores one', () => {
    const mutate = vi.fn();
    useUnarchiveProject.mockReturnValue({ mutate });
    useArchivedProjects.mockReturnValue({
      data: [{ id: 'a', name: 'Old Campaign', color: 'amber' }],
    });
    renderWithProviders(<ArchivedSection />);
    // Collapsed by default — the row appears after toggling open.
    expect(screen.queryByTestId('archived-project')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('archived-toggle'));
    expect(screen.getByText('Old Campaign')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('archived-restore'));
    expect(mutate).toHaveBeenCalledWith('a');
  });
});
