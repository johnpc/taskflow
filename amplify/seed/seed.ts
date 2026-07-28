/**
 * Idempotent seed runner: clears every owner-scoped model, then inserts the
 * demo workspace so re-running converges to the same state. Signs in as the
 * test user — all writes go through userPool (owner authz). Helpers live in
 * ./seedClient + ./clearAll + ./seedWorkspace; data in ./fixtures.
 *
 * Usage:
 *   npm run e2e-config   # ensure amplify_outputs.json exists
 *   npm run seed         # runs this script via tsx (needs .env.local creds)
 */
import { signIn, signOut } from 'aws-amplify/auth';
import './seedClient'; // configures Amplify + loads .env.local
import { clearAll } from './clearAll';
import { seedWorkspaceData } from './seedWorkspace';

async function main() {
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;
  if (!username || !password) {
    throw new Error(
      'TEST_USERNAME / TEST_PASSWORD required to seed (owner writes need a session).',
    );
  }
  await signOut().catch(() => {});
  await signIn({ username, password });

  await clearAll();
  console.log('Cleared all models.');

  await seedWorkspaceData();

  await signOut().catch(() => {});
  console.log('Seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
