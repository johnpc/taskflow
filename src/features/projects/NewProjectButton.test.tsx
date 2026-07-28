import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NewProjectButton } from './NewProjectButton';

describe('NewProjectButton', () => {
  it('expands into an input on click', () => {
    render(<NewProjectButton onCreate={vi.fn()} busy={false} />);
    fireEvent.click(screen.getByTestId('new-project'));
    expect(screen.getByTestId('new-project-input')).toBeInTheDocument();
  });

  it('creates a trimmed name on Enter', () => {
    const onCreate = vi.fn();
    render(<NewProjectButton onCreate={onCreate} busy={false} />);
    fireEvent.click(screen.getByTestId('new-project'));
    const input = screen.getByTestId('new-project-input');
    fireEvent.change(input, { target: { value: '  Roadmap  ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onCreate).toHaveBeenCalledWith('Roadmap');
  });

  it('creates via the Add button', () => {
    const onCreate = vi.fn();
    render(<NewProjectButton onCreate={onCreate} busy={false} />);
    fireEvent.click(screen.getByTestId('new-project'));
    fireEvent.change(screen.getByTestId('new-project-input'), { target: { value: 'X' } });
    fireEvent.click(screen.getByTestId('new-project-add'));
    expect(onCreate).toHaveBeenCalledWith('X');
  });

  it('closes without creating on empty submit', () => {
    const onCreate = vi.fn();
    render(<NewProjectButton onCreate={onCreate} busy={false} />);
    fireEvent.click(screen.getByTestId('new-project'));
    fireEvent.keyDown(screen.getByTestId('new-project-input'), { key: 'Enter' });
    expect(onCreate).not.toHaveBeenCalled();
    expect(screen.getByTestId('new-project')).toBeInTheDocument();
  });

  it('cancels on Escape', () => {
    render(<NewProjectButton onCreate={vi.fn()} busy={false} />);
    fireEvent.click(screen.getByTestId('new-project'));
    fireEvent.keyDown(screen.getByTestId('new-project-input'), { key: 'Escape' });
    expect(screen.getByTestId('new-project')).toBeInTheDocument();
  });
});
