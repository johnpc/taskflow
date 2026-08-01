import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LabelPickSelect } from './LabelPickSelect';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const labels = [{ id: 'l1', name: 'Bug' }] as any;

describe('LabelPickSelect', () => {
  it('renders nothing without labels', () => {
    const { container } = render(
      <LabelPickSelect labels={[]} placeholder="Add label…" testid="pick" onPick={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('fires the chosen label id, ignoring the placeholder', () => {
    const onPick = vi.fn();
    render(
      <LabelPickSelect labels={labels} placeholder="Add label…" testid="pick" onPick={onPick} />,
    );
    fireEvent.change(screen.getByTestId('pick'), { target: { value: '' } });
    expect(onPick).not.toHaveBeenCalled();
    fireEvent.change(screen.getByTestId('pick'), { target: { value: 'l1' } });
    expect(onPick).toHaveBeenCalledWith('l1');
  });
});
