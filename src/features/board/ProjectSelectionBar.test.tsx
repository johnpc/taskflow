import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectSelectionBar } from './ProjectSelectionBar';
import type { useBulkSelection } from './useBulkSelection';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sections = [{ id: 's1', name: 'To do' }] as any;

const bulk = (active: boolean) =>
  ({
    selection: { active, count: 2, clear: vi.fn() },
    completeSelected: vi.fn(),
    moveSelected: vi.fn(),
    assignSelected: vi.fn(),
    prioritizeSelected: vi.fn(),
    labelSelected: vi.fn(),
    deleteSelected: vi.fn(),
  }) as unknown as ReturnType<typeof useBulkSelection>;

describe('ProjectSelectionBar', () => {
  it('renders nothing when no selection is active', () => {
    render(<ProjectSelectionBar bulk={bulk(false)} sections={sections} members={[]} labels={[]} />);
    expect(screen.queryByTestId('selection-bar')).not.toBeInTheDocument();
  });

  it('renders the bar with the count when a selection is active', () => {
    render(<ProjectSelectionBar bulk={bulk(true)} sections={sections} members={[]} labels={[]} />);
    expect(screen.getByTestId('selection-bar')).toHaveTextContent('2 selected');
  });
});
