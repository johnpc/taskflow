import { describe, it, expect, vi } from 'vitest';
import { screen, act } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import { GroupBySegment } from './GroupBySegment';

describe('GroupBySegment', () => {
  it('reflects the current mode', () => {
    renderWithProviders(<GroupBySegment mode="priority" onChange={vi.fn()} />);
    expect(screen.getByTestId('mytasks-groupby')).toHaveAttribute('value', 'priority');
  });

  it('reports a new mode on ionChange', () => {
    const onChange = vi.fn();
    renderWithProviders(<GroupBySegment mode="due" onChange={onChange} />);
    const seg = screen.getByTestId('mytasks-groupby');
    act(() => {
      seg.dispatchEvent(
        new CustomEvent('ionChange', { detail: { value: 'priority' }, bubbles: true }),
      );
    });
    expect(onChange).toHaveBeenCalledWith('priority');
  });
});
