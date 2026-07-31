import { defineStorage } from '@aws-amplify/backend';

/**
 * Taskflow media bucket. Holds user avatar images under `avatars/{entity_id}/*`
 * — each signed-in user can read/write/delete their OWN avatar folder (keyed by
 * their identity id), and any authenticated user can READ every avatar (so a
 * teammate's picture renders on shared work). DECLARATIVE (gate-exempt).
 */
export const storage = defineStorage({
  name: 'taskflowMedia',
  access: (allow) => ({
    'avatars/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.authenticated.to(['read']),
    ],
  }),
});
