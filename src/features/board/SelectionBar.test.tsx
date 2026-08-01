import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectionBar } from './SelectionBar';

const sections = [
  { id: 's1', name: 'To do' },
  { id: 's2', name: 'Done' },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
] as any;

describe('SelectionBar', () => {
  it('shows the count and fires each action', () => {
    const onComplete = vi.fn();
    const onDelete = vi.fn();
    const onClear = vi.fn();
    render(
      <SelectionBar
        count={3}
        sections={sections}
        onComplete={onComplete}
        onMove={vi.fn()}
        onDelete={onDelete}
        onClear={onClear}
      />,
    );
    expect(screen.getByTestId('selection-bar')).toHaveTextContent('3 selected');
    fireEvent.click(screen.getByTestId('bulk-complete'));
    fireEvent.click(screen.getByTestId('bulk-delete'));
    fireEvent.click(screen.getByTestId('bulk-clear'));
    expect(onComplete).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledOnce();
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('moves the selection to a chosen section', () => {
    const onMove = vi.fn();
    render(
      <SelectionBar
        count={2}
        sections={sections}
        onComplete={vi.fn()}
        onMove={onMove}
        onDelete={vi.fn()}
        onClear={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByTestId('bulk-move'), { target: { value: 's2' } });
    expect(onMove).toHaveBeenCalledWith('s2');
  });

  it('assigns the selection to a chosen member when onAssign is given', () => {
    const onAssign = vi.fn();
    render(
      <SelectionBar
        count={2}
        sections={sections}
        members={['sam@x.co']}
        onComplete={vi.fn()}
        onMove={vi.fn()}
        onAssign={onAssign}
        onDelete={vi.fn()}
        onClear={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByTestId('bulk-assign'), { target: { value: 'sam@x.co' } });
    expect(onAssign).toHaveBeenCalledWith('sam@x.co');
  });

  it('omits the assign select without onAssign', () => {
    render(
      <SelectionBar
        count={1}
        sections={sections}
        onComplete={vi.fn()}
        onMove={vi.fn()}
        onDelete={vi.fn()}
        onClear={vi.fn()}
      />,
    );
    expect(screen.queryByTestId('bulk-assign')).not.toBeInTheDocument();
  });

  it('removes a label from the selection when onUnlabel + labels are given', () => {
    const onUnlabel = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const labels = [{ id: 'l1', name: 'Bug' }] as any;
    render(
      <SelectionBar
        count={2}
        sections={sections}
        labels={labels}
        onComplete={vi.fn()}
        onMove={vi.fn()}
        onUnlabel={onUnlabel}
        onDelete={vi.fn()}
        onClear={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByTestId('bulk-unlabel'), { target: { value: 'l1' } });
    expect(onUnlabel).toHaveBeenCalledWith('l1');
  });
});
