/** Shared Amplify client + helpers for the seed runner. */
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import type { Schema } from '../data/resource';

const here = dirname(fileURLToPath(import.meta.url));
const outputs = JSON.parse(readFileSync(resolve(here, '../../amplify_outputs.json'), 'utf8'));

Amplify.configure(outputs);
export const client = generateClient<Schema>({ authMode: 'userPool' });

// Every Taskflow model is owner-scoped, so all reads + writes go through the
// signed-in user's userPool session. The seed signs in as the test user.
export const OWNER_WRITE = { authMode: 'userPool' } as const;

// Load TEST_USERNAME/TEST_PASSWORD from .env.local if not already in the env.
const envLocal = resolve(here, '../../.env.local');
if (existsSync(envLocal)) {
  for (const line of readFileSync(envLocal, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

// Per-project sharing: every seeded record must list the seed user as a member
// (models authorize via ownersDefinedIn('members').identityClaim('email')), or
// the signed-in seed user can't read back what it just wrote. Single member in
// the seed — the demo workspace belongs to the test user.
export function seedMembers(): string[] {
  const email = process.env.TEST_USERNAME;
  return email ? [email] : [];
}

/** Minimal shape of an Amplify model needed to wipe it generically. */
interface ClearableModel {
  list: (opts: {
    limit: number;
    nextToken?: string;
    authMode: typeof OWNER_WRITE.authMode;
  }) => Promise<{ data: ({ id: string } | null)[]; nextToken?: string | null }>;
  delete: (id: { id: string }, opts: typeof OWNER_WRITE) => Promise<unknown>;
}

/**
 * Delete every row of one model, paginating through ALL pages (a single list()
 * returns only the first page). Both list AND delete use userPool — the seed
 * runs as the signed-in owner.
 */
export async function clearOneModel(model: ClearableModel): Promise<number> {
  let removed = 0;
  let token: string | undefined;
  do {
    const { data, nextToken } = await model.list({ limit: 1000, nextToken: token, ...OWNER_WRITE });
    const rows = data.filter((row): row is { id: string } => !!row?.id);
    await Promise.all(rows.map((row) => model.delete({ id: row.id }, OWNER_WRITE)));
    removed += rows.length;
    token = nextToken ?? undefined;
  } while (token);
  return removed;
}
