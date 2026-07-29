import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProjectMenu } from './ProjectMenu';

describe('ProjectMenu', () => {
  it('opens the action sheet', async () => {
    render(<ProjectMenu onArchive={vi.fn()} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByTestId('project-menu'));
    await waitFor(() => expect(screen.getByText('Archive project')).toBeInTheDocument());
  });

  it('archives from the sheet', async () => {
    const onArchive = vi.fn();
    render(<ProjectMenu onArchive={onArchive} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByTestId('project-menu'));
    const archive = await screen.findByText('Archive project');
    fireEvent.click(archive);
    await waitFor(() => expect(onArchive).toHaveBeenCalledOnce());
  });
});
