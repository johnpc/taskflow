/**
 * User profile server state — a display name keyed by email, readable by any
 * signed-in user (to resolve friendly names on shared work) and writable only
 * by its owner. Thin I/O over the Amplify client.
 */
import { dataClient } from '../../lib/dataClient';

export interface UserProfile {
  email: string;
  displayName: string | null;
  avatarKey: string | null;
}

/** The raw first profile row for an email (with its id), or null. */
async function profileRow(email: string) {
  const { data } = await dataClient.models.UserProfile.listUserProfileByEmail({ email });
  return (data ?? []).filter(Boolean)[0] ?? null;
}

/** Fetch a single user's profile by email, or null if they haven't set one. */
export async function fetchProfile(email: string): Promise<UserProfile | null> {
  const row = await profileRow(email);
  if (!row) return null;
  return {
    email: row.email,
    displayName: row.displayName ?? null,
    avatarKey: row.avatarKey ?? null,
  };
}

/** Set the signed-in user's display name — updates their existing profile row or
 * creates one. (Owner-scoped; the caller must be `email`.) */
export async function saveDisplayName(email: string, displayName: string): Promise<void> {
  const name = displayName.trim();
  const row = await profileRow(email);
  if (row) await dataClient.models.UserProfile.update({ id: row.id, displayName: name });
  else await dataClient.models.UserProfile.create({ email, displayName: name });
}

/** Persist the signed-in user's uploaded avatar S3 key (upsert their profile). */
export async function saveAvatarKey(email: string, avatarKey: string): Promise<void> {
  const row = await profileRow(email);
  if (row) await dataClient.models.UserProfile.update({ id: row.id, avatarKey });
  else await dataClient.models.UserProfile.create({ email, avatarKey });
}
