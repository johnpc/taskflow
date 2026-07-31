import { defineStorage } from '@aws-amplify/backend';

/**
 * Taskflow media bucket. DECLARATIVE (gate-exempt).
 * - `avatars/{entity_id}/*` — each signed-in user read/writes their OWN avatar
 *   folder (keyed by identity); any authenticated user can READ (teammate
 *   pictures render on shared work).
 * - `covers/*` — task cover images. Any authenticated user can read + write
 *   (project membership is enforced on the Task; the image is shared media a
 *   collaborator may set/replace).
 */
export const storage = defineStorage({
  name: 'taskflowMedia',
  access: (allow) => ({
    'avatars/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.authenticated.to(['read']),
    ],
    'covers/*': [allow.authenticated.to(['read', 'write', 'delete'])],
  }),
});
