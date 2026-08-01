import { describe, it, expect, vi, beforeEach } from 'vitest';

const { get, update } = vi.hoisted(() => ({ get: vi.fn(), update: vi.fn() }));
vi.mock('../../lib/dataClient', () => ({ dataClient: { models: { Task: { get, update } } } }));

import { ensureFollower } from './ensureFollower';

beforeEach(() => {
  get.mockReset();
  update.mockReset();
  update.mockResolvedValue({ errors: null });
});

describe('ensureFollower', () => {
  it('no-ops on a blank email', async () => {
    await ensureFollower('t', null);
    expect(get).not.toHaveBeenCalled();
  });

  it('adds the email when not already following', async () => {
    get.mockResolvedValue({ data: { id: 't', followers: ['other@x.co'] } });
    await ensureFollower('t', 'me@x.co');
    expect(update).toHaveBeenCalledWith({ id: 't', followers: ['other@x.co', 'me@x.co'] });
  });

  it('no-ops when already following (case-insensitive)', async () => {
    get.mockResolvedValue({ data: { id: 't', followers: ['ME@x.co'] } });
    await ensureFollower('t', 'me@x.co');
    expect(update).not.toHaveBeenCalled();
  });

  it('no-ops when the task is missing', async () => {
    get.mockResolvedValue({ data: null });
    await ensureFollower('t', 'me@x.co');
    expect(update).not.toHaveBeenCalled();
  });
});
