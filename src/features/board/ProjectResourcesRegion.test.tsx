import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const { useProjectResources } = vi.hoisted(() => ({ useProjectResources: vi.fn() }));
vi.mock('./useProjectResources', () => ({ useProjectResources }));

import { ProjectResourcesRegion } from './ProjectResourcesRegion';

beforeEach(() => {
  useProjectResources.mockReturnValue({
    query: { data: [{ id: 'r', title: 'Spec', url: 'https://x.co' }] },
    add: { mutate: vi.fn(), isPending: false },
    remove: { mutate: vi.fn() },
  });
});

describe('ProjectResourcesRegion', () => {
  it('is collapsed by default and expands to reveal the resources', () => {
    render(<ProjectResourcesRegion projectId="p1" />);
    expect(screen.getByTestId('key-resources-toggle')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByTestId('key-resource')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('key-resources-toggle'));
    expect(screen.getByTestId('key-resources-toggle')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Spec')).toBeInTheDocument();
  });

  it('shows the resource count in the header', () => {
    render(<ProjectResourcesRegion projectId="p1" />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
