import { describe, it, expect, vi, beforeEach } from 'vitest';

const { create, fetchBoard, currentMembers } = vi.hoisted(() => ({
  create: vi.fn(),
  fetchBoard: vi.fn(),
  currentMembers: vi.fn(),
}));

vi.mock('../../lib/dataClient', () => ({
  dataClient: {
    models: {
      Project: { create },
      Section: { create },
      Task: { create },
    },
  },
}));
vi.mock('../board/boardApi', () => ({ fetchBoard }));
vi.mock('../auth/members', () => ({ currentMembers }));

import { duplicateProject } from './duplicateProjectApi';
import type { ProjectRecord } from '../../lib/dataClient';

const source = { id: 'p1', name: 'Launch', color: 'rose', view: 'LIST' } as ProjectRecord;

beforeEach(() => {
  create.mockReset();
  currentMembers.mockResolvedValue(['me@x.co']);
});

describe('duplicateProject', () => {
  it('creates a copy, recreates sections, and copies open top-level tasks', async () => {
    create
      .mockResolvedValueOnce({ data: { id: 'p2', name: 'Launch (copy)' } }) // project
      .mockResolvedValueOnce({ data: { id: 's2' } }) // section
      .mockResolvedValue({ data: { id: 'x' } }); // tasks
    fetchBoard.mockResolvedValue({
      sections: [{ id: 's1', name: 'To do', sortOrder: 0 }],
      tasks: [
        { id: 't1', title: 'Open', status: 'TODO', sectionId: 's1' },
        { id: 't2', title: 'Done', status: 'DONE', sectionId: 's1' },
        { id: 't3', title: 'Sub', status: 'TODO', sectionId: 's1', parentTaskId: 't1' },
      ],
    });

    const result = await duplicateProject(source, 3);
    expect(result).toMatchObject({ id: 'p2' });
    // 1 project + 1 section + 1 open top-level task = 3 creates.
    expect(create).toHaveBeenCalledTimes(3);
    // The project copy carries the source name + color/view.
    expect(create.mock.calls[0][0]).toMatchObject({
      name: 'Launch (copy)',
      color: 'rose',
      view: 'LIST',
    });
    // The copied task lands in the NEW section id.
    expect(create.mock.calls[2][0]).toMatchObject({
      projectId: 'p2',
      sectionId: 's2',
      title: 'Open',
    });
  });

  it('throws when the project copy fails', async () => {
    create.mockResolvedValueOnce({ errors: [{ message: 'nope' }] });
    await expect(duplicateProject(source, 0)).rejects.toThrow(/Duplicate project failed/);
  });
});
