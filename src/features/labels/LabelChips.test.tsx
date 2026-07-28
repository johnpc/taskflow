import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LabelChips } from './LabelChips';
import type { LabelRecord } from '../../lib/dataClient';

describe('LabelChips', () => {
  it('renders a chip per label', () => {
    const labels = [
      { id: 'a', name: 'Marketing', color: 'rose' } as LabelRecord,
      { id: 'b', name: 'Urgent', color: 'amber' } as LabelRecord,
    ];
    render(<LabelChips labels={labels} />);
    expect(screen.getAllByTestId('label-chip')).toHaveLength(2);
    expect(screen.getByText('Marketing')).toBeInTheDocument();
  });

  it('renders nothing when empty', () => {
    const { container } = render(<LabelChips labels={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
