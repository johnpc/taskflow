import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const { createFromTemplate } = vi.hoisted(() => ({ createFromTemplate: vi.fn() }));
vi.mock('./createFromTemplate', () => ({ createFromTemplate }));

import { hookWrapper } from '../../test/hookWrapper';
import { useTemplates } from './useTemplates';
import { TEMPLATES } from './templateCatalog';

beforeEach(() => createFromTemplate.mockReset());

describe('useTemplates', () => {
  it('creates a project from a template and returns its id', async () => {
    createFromTemplate.mockResolvedValue('new-id');
    const { result } = renderHook(() => useTemplates(), { wrapper: hookWrapper() });
    let id: string | undefined;
    await act(async () => {
      id = await result.current.mutateAsync({ template: TEMPLATES[0], sortOrder: 2 });
    });
    expect(createFromTemplate).toHaveBeenCalledWith(TEMPLATES[0], 2);
    expect(id).toBe('new-id');
  });
});
