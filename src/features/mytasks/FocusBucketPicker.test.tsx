import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FocusBucketPicker } from './FocusBucketPicker';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'T', myBucket: 'NONE', ...over }) as TaskRecord;

describe('FocusBucketPicker', () => {
  it('reflects the current bucket', () => {
    render(<FocusBucketPicker task={task({ myBucket: 'TODAY' })} onChange={vi.fn()} />);
    expect(screen.getByTestId('focus-bucket-select')).toHaveValue('TODAY');
  });

  it('reports a new bucket on change', () => {
    const onChange = vi.fn();
    render(<FocusBucketPicker task={task({})} onChange={onChange} />);
    fireEvent.change(screen.getByTestId('focus-bucket-select'), { target: { value: 'LATER' } });
    expect(onChange).toHaveBeenCalledWith('LATER');
  });
});
