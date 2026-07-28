import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';

const { useBoard, useProject } = vi.hoisted(() => ({ useBoard: vi.fn(), useProject: vi.fn() }));
vi.mock('./useBoard', () => ({ useBoard }));
vi.mock('./useProject', () => ({ useProject }));

import { renderWithProviders } from '../../test/renderWithProviders';
import { ProjectView } from './ProjectView';
import type { SectionRecord } from '../../lib/dataClient';

beforeEach(() => {
  useBoard.mockReset();
  useProject.mockReset();
  useProject.mockReturnValue({ data: { id: 'p', name: 'Launch' } });
});

describe('ProjectView', () => {
  it('renders the board columns', () => {
    useBoard.mockReturnValue({
      query: { isLoading: false, isError: false, refetch: vi.fn() },
      columns: [{ section: { id: 's1', name: 'To do' } as SectionRecord, tasks: [] }],
      addTask: { mutate: vi.fn() },
      toggleDone: { mutate: vi.fn() },
      labels: [],
    });
    renderWithProviders(<ProjectView />, '/projects/p');
    expect(screen.getByTestId('board')).toBeInTheDocument();
    expect(screen.getByText('To do')).toBeInTheDocument();
  });

  it('switches to the list view via the toggle', () => {
    useBoard.mockReturnValue({
      query: { isLoading: false, isError: false, refetch: vi.fn() },
      columns: [{ section: { id: 's1', name: 'To do' } as SectionRecord, tasks: [] }],
      addTask: { mutate: vi.fn() },
      toggleDone: { mutate: vi.fn() },
      labels: [],
    });
    renderWithProviders(<ProjectView />, '/projects/p');
    expect(screen.getByTestId('board')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('view-list'));
    expect(screen.getByTestId('list-view')).toBeInTheDocument();
  });

  it('shows the empty state with no columns', () => {
    useBoard.mockReturnValue({
      query: { isLoading: false, isError: false, refetch: vi.fn() },
      columns: [],
      addTask: { mutate: vi.fn() },
      toggleDone: { mutate: vi.fn() },
      labels: [],
    });
    renderWithProviders(<ProjectView />, '/projects/p');
    expect(screen.getByTestId('load-empty')).toBeInTheDocument();
  });
});
