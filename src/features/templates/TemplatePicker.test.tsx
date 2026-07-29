import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TemplatePicker } from './TemplatePicker';
import { TEMPLATES } from './templateCatalog';

describe('TemplatePicker', () => {
  it('renders a card per template', () => {
    render(<TemplatePicker onPick={vi.fn()} busy={false} />);
    for (const t of TEMPLATES) {
      expect(screen.getByTestId(`template-${t.key}`)).toBeInTheDocument();
    }
  });

  it('reports the picked template', () => {
    const onPick = vi.fn();
    render(<TemplatePicker onPick={onPick} busy={false} />);
    fireEvent.click(screen.getByTestId('template-sprint'));
    expect(onPick).toHaveBeenCalledWith(expect.objectContaining({ key: 'sprint' }));
  });
});
