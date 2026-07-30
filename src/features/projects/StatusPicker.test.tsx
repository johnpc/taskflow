import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatusPicker } from './StatusPicker';

describe('StatusPicker', () => {
  it('sets a status when its button is clicked', () => {
    const onChange = vi.fn();
    render(<StatusPicker status={null} note={null} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('status-set-ON_TRACK'));
    expect(onChange).toHaveBeenCalledWith({ status: 'ON_TRACK' });
  });

  it('clears the status when the active button is re-clicked', () => {
    const onChange = vi.fn();
    render(<StatusPicker status="ON_TRACK" note={null} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('status-set-ON_TRACK'));
    expect(onChange).toHaveBeenCalledWith({ status: null });
  });

  it('hides the note field until a status is set', () => {
    const { rerender } = render(<StatusPicker status={null} note={null} onChange={vi.fn()} />);
    expect(screen.queryByTestId('status-note')).toBeNull();
    rerender(<StatusPicker status="AT_RISK" note={null} onChange={vi.fn()} />);
    expect(screen.getByTestId('status-note')).toBeInTheDocument();
  });

  it('commits a changed note on blur', () => {
    const onChange = vi.fn();
    render(<StatusPicker status="AT_RISK" note={null} onChange={onChange} />);
    const note = screen.getByTestId('status-note');
    fireEvent.change(note, { target: { value: 'Waiting on design' } });
    fireEvent.blur(note);
    expect(onChange).toHaveBeenCalledWith({ status: 'AT_RISK', statusNote: 'Waiting on design' });
  });

  it('does not commit an unchanged note', () => {
    const onChange = vi.fn();
    render(<StatusPicker status="AT_RISK" note="same" onChange={onChange} />);
    fireEvent.blur(screen.getByTestId('status-note'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
