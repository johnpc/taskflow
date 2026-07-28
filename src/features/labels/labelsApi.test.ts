import { describe, it, expect, vi, beforeEach } from 'vitest';

const { list, create } = vi.hoisted(() => ({ list: vi.fn(), create: vi.fn() }));
vi.mock('../../lib/dataClient', () => ({
  dataClient: { models: { Label: { list, create } } },
}));

import { fetchLabels, createLabel } from './labelsApi';

beforeEach(() => {
  list.mockReset();
  create.mockReset();
});

describe('fetchLabels', () => {
  it('name-sorts and drops nulls', async () => {
    list.mockResolvedValue({ data: [{ id: 'b', name: 'Zed' }, null, { id: 'a', name: 'Alpha' }] });
    expect((await fetchLabels()).map((l) => l.id)).toEqual(['a', 'b']);
  });
});

describe('createLabel', () => {
  it('creates a trimmed label', async () => {
    create.mockResolvedValue({ data: { id: 'x' }, errors: null });
    await createLabel({ name: '  Urgent ', color: 'rose' });
    expect(create).toHaveBeenCalledWith({ name: 'Urgent', color: 'rose' });
  });
  it('throws on error', async () => {
    create.mockResolvedValue({ data: null, errors: [{}] });
    await expect(createLabel({ name: 'X', color: 'sky' })).rejects.toThrow();
  });
});
