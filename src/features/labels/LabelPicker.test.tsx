import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LabelPicker } from './LabelPicker';
import type { LabelRecord } from '../../lib/dataClient';

const reg: LabelRecord[] = [
  { id: 'a', name: 'Marketing', color: 'rose' } as LabelRecord,
  { id: 'b', name: 'Design', color: 'violet' } as LabelRecord,
];

describe('LabelPicker', () => {
  it('marks applied labels pressed', () => {
    render(
      <LabelPicker
        registry={reg}
        selectedIds={new Set(['a'])}
        onToggle={vi.fn()}
        onCreate={vi.fn()}
      />,
    );
    const opts = screen.getAllByTestId('label-option');
    expect(opts[0]).toHaveAttribute('aria-pressed', 'true');
    expect(opts[1]).toHaveAttribute('aria-pressed', 'false');
  });

  it('toggles a label', () => {
    const onToggle = vi.fn();
    render(
      <LabelPicker registry={reg} selectedIds={new Set()} onToggle={onToggle} onCreate={vi.fn()} />,
    );
    fireEvent.click(screen.getAllByTestId('label-option')[1]);
    expect(onToggle).toHaveBeenCalledWith('b');
  });

  it('creates a new label on Enter', () => {
    const onCreate = vi.fn();
    render(
      <LabelPicker registry={reg} selectedIds={new Set()} onToggle={vi.fn()} onCreate={onCreate} />,
    );
    const input = screen.getByTestId('label-new-input');
    fireEvent.change(input, { target: { value: 'Backend' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onCreate).toHaveBeenCalledWith(expect.objectContaining({ name: 'Backend' }));
  });
});
