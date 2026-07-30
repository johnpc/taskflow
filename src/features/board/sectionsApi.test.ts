import { describe, it, expect, vi, beforeEach } from 'vitest';

const { create, update, del } = vi.hoisted(() => ({
  create: vi.fn(),
  update: vi.fn(),
  del: vi.fn(),
}));
vi.mock('../../lib/dataClient', () => ({
  dataClient: { models: { Section: { create, update, delete: del } } },
}));

import { createSection, renameSection, deleteSection } from './sectionsApi';

beforeEach(() => {
  create.mockReset();
  update.mockReset();
  del.mockReset();
});

describe('sectionsApi', () => {
  it('creates a section with a trimmed name + order', async () => {
    create.mockResolvedValue({ errors: null });
    await createSection({ projectId: 'p', name: '  Review ', order: 3 });
    expect(create).toHaveBeenCalledWith({
      projectId: 'p',
      name: 'Review',
      sortOrder: 3,
      members: [],
    });
  });

  it('renames a section', async () => {
    update.mockResolvedValue({ errors: null });
    await renameSection('s', '  Shipped ');
    expect(update).toHaveBeenCalledWith({ id: 's', name: 'Shipped' });
  });

  it('deletes a section', async () => {
    del.mockResolvedValue({ errors: null });
    await deleteSection('s');
    expect(del).toHaveBeenCalledWith({ id: 's' });
  });

  it('throws on error', async () => {
    create.mockResolvedValue({ errors: [{}] });
    await expect(createSection({ projectId: 'p', name: 'X', order: 0 })).rejects.toThrow();
  });
});
