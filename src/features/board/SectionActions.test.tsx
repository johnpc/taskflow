import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SectionActions } from './SectionActions';

describe('SectionActions', () => {
  it('renders nothing without handlers', () => {
    const { container } = render(<SectionActions name="To do" />);
    expect(container.firstChild).toBeNull();
  });

  it('deletes on the trash button', () => {
    const onDelete = vi.fn();
    render(<SectionActions name="To do" onDelete={onDelete} />);
    fireEvent.click(screen.getByTestId('section-delete'));
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it('renames via the edit affordance', () => {
    const onRename = vi.fn();
    render(<SectionActions name="To do" onRename={onRename} />);
    fireEvent.click(screen.getByTestId('section-rename'));
    const input = screen.getByTestId('section-rename-input');
    fireEvent.change(input, { target: { value: 'In review' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onRename).toHaveBeenCalledWith('In review');
  });

  it('does not rename when unchanged', () => {
    const onRename = vi.fn();
    render(<SectionActions name="To do" onRename={onRename} />);
    fireEvent.click(screen.getByTestId('section-rename'));
    fireEvent.click(screen.getByTestId('section-rename-save'));
    expect(onRename).not.toHaveBeenCalled();
  });
});
