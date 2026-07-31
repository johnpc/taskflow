import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProjectMenu } from './ProjectMenu';

const menu = (props: Partial<Parameters<typeof ProjectMenu>[0]> = {}) =>
  render(
    <ProjectMenu
      onCopyLink={props.onCopyLink ?? vi.fn()}
      onDuplicate={props.onDuplicate ?? vi.fn()}
      onArchive={props.onArchive ?? vi.fn()}
      onDelete={props.onDelete ?? vi.fn()}
    />,
  );

describe('ProjectMenu', () => {
  it('opens the action sheet', async () => {
    menu();
    fireEvent.click(screen.getByTestId('project-menu'));
    await waitFor(() => expect(screen.getByText('Archive project')).toBeInTheDocument());
  });

  it('archives from the sheet', async () => {
    const onArchive = vi.fn();
    menu({ onArchive });
    fireEvent.click(screen.getByTestId('project-menu'));
    const archive = await screen.findByText('Archive project');
    fireEvent.click(archive);
    await waitFor(() => expect(onArchive).toHaveBeenCalledOnce());
  });

  it('duplicates from the sheet', async () => {
    const onDuplicate = vi.fn();
    menu({ onDuplicate });
    fireEvent.click(screen.getByTestId('project-menu'));
    const dup = await screen.findByText('Duplicate project');
    fireEvent.click(dup);
    await waitFor(() => expect(onDuplicate).toHaveBeenCalledOnce());
  });

  it('copies the project link from the sheet', async () => {
    const onCopyLink = vi.fn();
    menu({ onCopyLink });
    fireEvent.click(screen.getByTestId('project-menu'));
    const copy = await screen.findByText('Copy link');
    fireEvent.click(copy);
    await waitFor(() => expect(onCopyLink).toHaveBeenCalledOnce());
  });
});
