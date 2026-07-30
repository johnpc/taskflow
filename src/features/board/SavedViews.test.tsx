import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SavedViews } from './SavedViews';
import { DEFAULT_FILTER } from './taskFilter';

const views = [{ name: 'Urgent', filter: { ...DEFAULT_FILTER, priority: 'HIGH' as const } }];

describe('SavedViews', () => {
  it('applies a saved view on chip click', () => {
    const onApply = vi.fn();
    render(<SavedViews views={views} onApply={onApply} onSave={vi.fn()} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByText('Urgent'));
    expect(onApply).toHaveBeenCalledWith(views[0]);
  });

  it('deletes a saved view', () => {
    const onDelete = vi.fn();
    render(<SavedViews views={views} onApply={vi.fn()} onSave={vi.fn()} onDelete={onDelete} />);
    fireEvent.click(screen.getByTestId('saved-view-delete'));
    expect(onDelete).toHaveBeenCalledWith('Urgent');
  });

  it('saves the current filter under a typed name', () => {
    const onSave = vi.fn();
    render(<SavedViews views={[]} onApply={vi.fn()} onSave={onSave} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByTestId('saved-view-save'));
    const input = screen.getByTestId('saved-view-name');
    fireEvent.change(input, { target: { value: 'My view' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSave).toHaveBeenCalledWith('My view');
  });
});
