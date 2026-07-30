import { defineFunction } from '@aws-amplify/backend';

/** Pre-token-generation trigger that injects `email` into the access token so
 * AppSync email-based member auth works (see handler.ts). */
export const preTokenGeneration = defineFunction({
  name: 'pre-token-generation',
  // Live in the auth stack — it's a Cognito trigger, so wiring it there avoids a
  // circular dependency between the auth, data, and function nested stacks.
  resourceGroupName: 'auth',
});
