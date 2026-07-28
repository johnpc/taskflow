import { describe, it, expect, vi, beforeEach } from 'vitest';

const { listSections, listTasks, createSection } = vi.hoisted(() => ({
  listSections: vi.fn(),
  listTasks: vi.fn(),
  createSection: vi.fn(),
}));
vi.mock('../../lib/dataClient', () => ({
  dataClient: {
    models: {
      Section: { listSectionByProjectIdAndSortOrder: listSections, create: createSection },
      Task: { listTaskByProjectIdAndSortOrder: listTasks },
    },
  },
}));

import { fetchBoard, ensureDefaultSections } from './boardApi';
import type { SectionRecord } from '../../lib/dataClient';

beforeEach(() => {
  listSections.mockReset();
  listTasks.mockReset();
  createSection.mockReset();
});

describe('fetchBoard', () => {
  it('returns the project sections + tasks', async () => {
    listSections.mockResolvedValue({ data: [{ id: 's1' }, null] });
    listTasks.mockResolvedValue({ data: [{ id: 't1' }] });
    const out = await fetchBoard('p');
    expect(out.sections.map((s) => s.id)).toEqual(['s1']);
    expect(out.tasks.map((t) => t.id)).toEqual(['t1']);
  });
});

describe('ensureDefaultSections', () => {
  it('returns existing sections untouched', async () => {
    const existing = [{ id: 's1' }] as SectionRecord[];
    const out = await ensureDefaultSections('p', existing);
    expect(out).toBe(existing);
    expect(createSection).not.toHaveBeenCalled();
  });

  it('creates the three default columns when none exist', async () => {
    createSection
      .mockResolvedValueOnce({ data: { id: 'c1', name: 'To do' } })
      .mockResolvedValueOnce({ data: { id: 'c2', name: 'In progress' } })
      .mockResolvedValueOnce({ data: { id: 'c3', name: 'Done' } });
    const out = await ensureDefaultSections('p', []);
    expect(out.map((s) => s.name)).toEqual(['To do', 'In progress', 'Done']);
    expect(createSection).toHaveBeenCalledTimes(3);
  });
});
