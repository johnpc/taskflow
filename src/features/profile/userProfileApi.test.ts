import { describe, it, expect, vi, beforeEach } from 'vitest';

const { list, create, update } = vi.hoisted(() => ({
  list: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
}));
vi.mock('../../lib/dataClient', () => ({
  dataClient: {
    models: { UserProfile: { listUserProfileByEmail: list, create, update } },
  },
}));

import { fetchProfile, saveDisplayName } from './userProfileApi';

beforeEach(() => {
  list.mockReset();
  create.mockReset();
  update.mockReset();
});

describe('userProfileApi', () => {
  it('fetchProfile returns the display name for an email', async () => {
    list.mockResolvedValue({ data: [{ id: 'p1', email: 'a@x.co', displayName: 'Ada' }] });
    expect(await fetchProfile('a@x.co')).toEqual({ email: 'a@x.co', displayName: 'Ada' });
  });

  it('fetchProfile returns null when no profile exists', async () => {
    list.mockResolvedValue({ data: [] });
    expect(await fetchProfile('a@x.co')).toBeNull();
  });

  it('saveDisplayName updates an existing row', async () => {
    list.mockResolvedValue({ data: [{ id: 'p1', email: 'a@x.co', displayName: 'old' }] });
    await saveDisplayName('a@x.co', '  Ada Lovelace  ');
    expect(update).toHaveBeenCalledWith({ id: 'p1', displayName: 'Ada Lovelace' });
    expect(create).not.toHaveBeenCalled();
  });

  it('saveDisplayName creates a row when none exists', async () => {
    list.mockResolvedValue({ data: [] });
    await saveDisplayName('a@x.co', 'Ada');
    expect(create).toHaveBeenCalledWith({ email: 'a@x.co', displayName: 'Ada' });
  });
});
