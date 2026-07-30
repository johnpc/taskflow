import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const { fetchCustomFields, createCustomField } = vi.hoisted(() => ({
  fetchCustomFields: vi.fn(),
  createCustomField: vi.fn(),
}));
vi.mock('./customFieldsApi', () => ({ fetchCustomFields, createCustomField }));

import { hookWrapper } from '../../test/hookWrapper';
import { useCustomFields } from './useCustomFields';

beforeEach(() => {
  fetchCustomFields.mockReset();
  createCustomField.mockReset();
});

describe('useCustomFields', () => {
  it('loads a project fields and adds one at the next order', async () => {
    fetchCustomFields.mockResolvedValue([{ id: 'f1', name: 'Size' }]);
    createCustomField.mockResolvedValue({ id: 'f2' });
    const { result } = renderHook(() => useCustomFields('p'), { wrapper: hookWrapper() });
    await waitFor(() => expect(result.current.fields).toHaveLength(1));
    await act(async () => {
      await result.current.add.mutateAsync('Team');
    });
    expect(createCustomField).toHaveBeenCalledWith({ projectId: 'p', name: 'Team', order: 1 });
  });
});
