import { describe, it, expect, vi, beforeEach } from 'vitest';

const { create, fetchBoard, membersForProject } = vi.hoisted(() => ({
  create: vi.fn(),
  fetchBoard: vi.fn(),
  membersForProject: vi.fn(),
}));

vi.mock('../../lib/dataClient', () => ({
  dataClient: { models: { Section: { create }, Task: { create } } },
}));
vi.mock('./boardApi', () => ({ fetchBoard }));
vi.mock('../auth/members', () => ({ membersForProject }));

import { duplicateSection } from './duplicateSectionApi';
import type { SectionRecord } from '../../lib/dataClient';

const section = { id: 's1', projectId: 'p', name: 'To do', sortOrder: 0 } as SectionRecord;

beforeEach(() => {
  create.mockReset();
  membersForProject.mockResolvedValue(['me@x.co']);
});

describe('duplicateSection', () => {
  it('creates a "(copy)" section and copies only its open top-level tasks', async () => {
    create
      .mockResolvedValueOnce({ data: { id: 's2', name: 'To do (copy)' } }) // section
      .mockResolvedValue({ data: { id: 'x' } }); // tasks
    fetchBoard.mockResolvedValue({
      sections: [section],
      tasks: [
        { id: 't1', title: 'Open', status: 'TODO', sectionId: 's1' },
        { id: 't2', title: 'Elsewhere', status: 'TODO', sectionId: 'other' },
        { id: 't3', title: 'Done', status: 'DONE', sectionId: 's1' },
      ],
    });

    const created = await duplicateSection(section);
    expect(created).toMatchObject({ id: 's2' });
    // 1 section + 1 open task in THIS section = 2 creates.
    expect(create).toHaveBeenCalledTimes(2);
    expect(create.mock.calls[0][0]).toMatchObject({ name: 'To do (copy)', sortOrder: 1 });
    expect(create.mock.calls[1][0]).toMatchObject({ sectionId: 's2', title: 'Open' });
  });

  it('throws when the section copy fails', async () => {
    create.mockResolvedValueOnce({ errors: [{ message: 'no' }] });
    await expect(duplicateSection(section)).rejects.toThrow(/Duplicate section failed/);
  });
});
