import { describe, it, expect, vi, beforeEach } from 'vitest';

const { list, create, projectGet } = vi.hoisted(() => ({
  list: vi.fn(),
  create: vi.fn(),
  projectGet: vi.fn(),
}));
vi.mock('../../lib/dataClient', () => ({
  dataClient: {
    models: {
      CustomField: { listCustomFieldByProjectId: list, create },
      Project: { get: projectGet },
    },
  },
}));

import { fetchCustomFields, createCustomField } from './customFieldsApi';

beforeEach(() => {
  list.mockReset();
  create.mockReset();
  projectGet.mockReset();
  projectGet.mockResolvedValue({ data: { members: ['me@x.co'] } });
});

describe('customFieldsApi', () => {
  it('lists fields ordered by sortOrder', async () => {
    list.mockResolvedValue({
      data: [
        { id: 'b', sortOrder: 1 },
        { id: 'a', sortOrder: 0 },
      ],
    });
    expect((await fetchCustomFields('p')).map((f) => f.id)).toEqual(['a', 'b']);
  });

  it('creates a TEXT field with the project members', async () => {
    create.mockResolvedValue({ data: { id: 'f' }, errors: null });
    await createCustomField({ projectId: 'p', name: '  Size ', order: 2 });
    expect(create).toHaveBeenCalledWith({
      projectId: 'p',
      name: 'Size',
      fieldType: 'TEXT',
      sortOrder: 2,
      members: ['me@x.co'],
    });
  });

  it('throws when create errors', async () => {
    create.mockResolvedValue({ data: null, errors: [{ message: 'no' }] });
    await expect(createCustomField({ projectId: 'p', name: 'X', order: 0 })).rejects.toThrow();
  });
});
