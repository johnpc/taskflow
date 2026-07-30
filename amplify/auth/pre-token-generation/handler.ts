import type { PreTokenGenerationV2TriggerHandler } from 'aws-lambda';

/**
 * Adds the user's `email` to the ACCESS token. AppSync reads the access token
 * for authorization, but Cognito only puts `email` in the ID token by default —
 * so `allow.ownersDefinedIn('members').identityClaim('email')` would match no
 * one and deny every request. Copying email into the access token's claims makes
 * per-project email membership work. (V2 trigger — required to edit the access
 * token; the classic V1 event can only edit the ID token.)
 */
export const handler: PreTokenGenerationV2TriggerHandler = async (event) => {
  const email = event.request.userAttributes.email;
  if (email) {
    event.response = {
      claimsAndScopeOverrideDetails: {
        accessTokenGeneration: {
          claimsToAddOrOverride: { email },
        },
      },
    };
  }
  return event;
};
