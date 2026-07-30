import { describe, it, expect, vi, beforeEach } from 'vitest';

const { listSections, update } = vi.hoisted(() => ({ listSections: vi.fn(), update: vi.fn() }));
vi.mock('../../lib/dataClient', () => ({
  dataClient: {
    models: {
      Section: { listSectionByProjectIdAndSortOrder: listSections },
      Task: { update },
    },
  },
}));

import { promoteSubtask } from './promoteSubtask';
import type { TaskRecord } from '../../lib/dataClient';

const task = { id: 't', projectId: 'p', parentTaskId: 'parent' } as TaskRecord;

beforeEach(() => {
  listSections.mockReset();
  update.mockReset().mockResolvedValue({ errors: null });
});

describe('promoteSubtask', () => {
  it('clears the parent and drops it into the project first section', async () => {
    listSections.mockResolvedValue({ data: [{ id: 's1' }] });
    await promoteSubtask(task);
    expect(update).toHaveBeenCalledWith({ id: 't', parentTaskId: null, sectionId: 's1' });
  });

  it('promotes with no section when the project has none', async () => {
    listSections.mockResolvedValue({ data: [] });
    await promoteSubtask(task);
    expect(update).toHaveBeenCalledWith({ id: 't', parentTaskId: null, sectionId: undefined });
  });
});
