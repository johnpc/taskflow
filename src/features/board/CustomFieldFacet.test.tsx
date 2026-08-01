import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomFieldFacet } from './CustomFieldFacet';
import { DEFAULT_FILTER } from './taskFilter';
import type { CustomFieldRecord } from '../../lib/dataClient';

const field = (over: Partial<CustomFieldRecord>): CustomFieldRecord =>
  ({ id: 'f', name: 'F', fieldType: 'SELECT', options: [], ...over }) as CustomFieldRecord;

describe('CustomFieldFacet', () => {
  it('renders nothing when there are no SELECT fields', () => {
    const { container } = render(
      <CustomFieldFacet
        fields={[field({ id: 't', name: 'Notes', fieldType: 'TEXT' })]}
        filter={DEFAULT_FILTER}
        onChange={vi.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('picks a field then shows its options and reports the chosen value', () => {
    const onChange = vi.fn();
    const fields = [field({ id: 'st', name: 'Stage', options: ['Todo', 'Doing'] })];
    const { rerender } = render(
      <CustomFieldFacet fields={fields} filter={DEFAULT_FILTER} onChange={onChange} />,
    );
    // No field chosen yet → no value select.
    expect(screen.queryByTestId('filter-cf-value')).not.toBeInTheDocument();
    fireEvent.change(screen.getByTestId('filter-cf-field'), { target: { value: 'st' } });
    expect(onChange).toHaveBeenCalledWith({ customFieldId: 'st', customValue: '' });

    rerender(
      <CustomFieldFacet
        fields={fields}
        filter={{ ...DEFAULT_FILTER, customFieldId: 'st' }}
        onChange={onChange}
      />,
    );
    fireEvent.change(screen.getByTestId('filter-cf-value'), { target: { value: 'Doing' } });
    expect(onChange).toHaveBeenCalledWith({ customValue: 'Doing' });
  });
});
