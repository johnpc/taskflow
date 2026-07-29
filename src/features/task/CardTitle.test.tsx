import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CardTitle } from './CardTitle';

describe('CardTitle', () => {
  it('opens on title click', () => {
    const onOpen = vi.fn();
    render(<CardTitle title="Ship it" onOpen={onOpen} />);
    fireEvent.click(screen.getByTestId('task-open'));
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it('renames via the pencil then Enter', () => {
    const onRename = vi.fn();
    render(<CardTitle title="Ship it" onOpen={vi.fn()} onRename={onRename} />);
    fireEvent.click(screen.getByTestId('card-rename'));
    const input = screen.getByTestId('card-title-input');
    fireEvent.change(input, { target: { value: 'Ship it today' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onRename).toHaveBeenCalledWith('Ship it today');
  });

  it('has no pencil without a rename handler', () => {
    render(<CardTitle title="Ship it" onOpen={vi.fn()} />);
    expect(screen.queryByTestId('card-rename')).not.toBeInTheDocument();
  });

  it('cancels rename on Escape', () => {
    const onRename = vi.fn();
    render(<CardTitle title="Ship it" onOpen={vi.fn()} onRename={onRename} />);
    fireEvent.click(screen.getByTestId('card-rename'));
    fireEvent.keyDown(screen.getByTestId('card-title-input'), { key: 'Escape' });
    expect(onRename).not.toHaveBeenCalled();
    expect(screen.getByTestId('task-open')).toBeInTheDocument();
  });
});
