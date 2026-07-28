import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthField } from './AuthField';

describe('AuthField', () => {
  it('renders the label and current value', () => {
    render(<AuthField label="Email" type="email" value="a@b.co" onChange={vi.fn()} />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByDisplayValue('a@b.co')).toBeInTheDocument();
  });

  it('fires onChange with the new value', () => {
    const onChange = vi.fn();
    render(<AuthField label="Email" type="text" value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'x' } });
    expect(onChange).toHaveBeenCalledWith('x');
  });
});
