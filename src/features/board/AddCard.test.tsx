import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddCard } from './AddCard';

describe('AddCard', () => {
  it('expands into an input', () => {
    render(<AddCard onAdd={vi.fn()} busy={false} />);
    fireEvent.click(screen.getByTestId('add-card'));
    expect(screen.getByTestId('add-card-input')).toBeInTheDocument();
  });

  it('adds a trimmed title on Enter and stays open', () => {
    const onAdd = vi.fn();
    render(<AddCard onAdd={onAdd} busy={false} />);
    fireEvent.click(screen.getByTestId('add-card'));
    const input = screen.getByTestId('add-card-input');
    fireEvent.change(input, { target: { value: '  Task  ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onAdd).toHaveBeenCalledWith('Task');
    expect(screen.getByTestId('add-card-input')).toBeInTheDocument();
  });

  it('closes on empty Enter', () => {
    const onAdd = vi.fn();
    render(<AddCard onAdd={onAdd} busy={false} />);
    fireEvent.click(screen.getByTestId('add-card'));
    fireEvent.keyDown(screen.getByTestId('add-card-input'), { key: 'Enter' });
    expect(onAdd).not.toHaveBeenCalled();
    expect(screen.getByTestId('add-card')).toBeInTheDocument();
  });

  it('closes on Escape', () => {
    render(<AddCard onAdd={vi.fn()} busy={false} />);
    fireEvent.click(screen.getByTestId('add-card'));
    fireEvent.keyDown(screen.getByTestId('add-card-input'), { key: 'Escape' });
    expect(screen.getByTestId('add-card')).toBeInTheDocument();
  });
});
