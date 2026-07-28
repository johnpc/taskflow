import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { BoardContent } from './BoardContent';
import { renderWithProviders } from '../../test/renderWithProviders';
import type { Column } from './taskGrouping';
import type { SectionRecord } from '../../lib/dataClient';

const columns: Column[] = [{ section: { id: 's1', name: 'To do' } as SectionRecord, tasks: [] }];

describe('BoardContent', () => {
  it('renders the board layout in BOARD mode', () => {
    renderWithProviders(
      <BoardContent mode="BOARD" columns={columns} onAddTask={vi.fn()} onToggleDone={vi.fn()} />,
    );
    expect(screen.getByTestId('board')).toBeInTheDocument();
    expect(screen.queryByTestId('list-view')).not.toBeInTheDocument();
  });

  it('renders the list layout in LIST mode', () => {
    renderWithProviders(
      <BoardContent mode="LIST" columns={columns} onAddTask={vi.fn()} onToggleDone={vi.fn()} />,
    );
    expect(screen.getByTestId('list-view')).toBeInTheDocument();
    expect(screen.queryByTestId('board')).not.toBeInTheDocument();
  });
});
