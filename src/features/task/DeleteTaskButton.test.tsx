import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DeleteTaskButton } from './DeleteTaskButton';

describe('DeleteTaskButton', () => {
  it('renders a delete affordance', () => {
    render(<DeleteTaskButton onDelete={vi.fn()} />);
    expect(screen.getByTestId('task-delete')).toBeInTheDocument();
  });

  it('opens a confirm alert on click', async () => {
    render(<DeleteTaskButton onDelete={vi.fn()} />);
    fireEvent.click(screen.getByTestId('task-delete'));
    // IonAlert mounts its content (header text) once opened.
    await waitFor(() => expect(screen.getByText("This can't be undone.")).toBeInTheDocument());
  });

  it('deletes when the confirm button is pressed', async () => {
    const onDelete = vi.fn();
    render(<DeleteTaskButton onDelete={onDelete} />);
    fireEvent.click(screen.getByTestId('task-delete'));
    const confirm = await screen.findByText('Delete', {}, { timeout: 3000 });
    fireEvent.click(confirm);
    await waitFor(() => expect(onDelete).toHaveBeenCalledOnce());
  });
});
