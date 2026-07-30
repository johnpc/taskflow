import { defineAuth } from '@aws-amplify/backend';

/**
 * Taskflow auth — email/password Cognito user pool + identity pool.
 *
 * Taskflow is ACCOUNT-BASED with per-project sharing (not guest-first). Data
 * models authorize via allow.ownersDefinedIn('members').identityClaim('email').
 * AppSync reads the ACCESS token, which by default lacks `email` (that lives in
 * the ID token), so a pre-token-generation trigger (V2) copies `email` into the
 * access token — without it every member-scoped request is Unauthorized. The
 * trigger + V2 wiring live in backend.ts (the V2 access-token override needs the
 * CDK escape hatch). See the CLAUDE.md auth-contract decision.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
