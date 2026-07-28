import { defineAuth } from '@aws-amplify/backend';

/**
 * Taskflow auth — email/password Cognito user pool + identity pool.
 *
 * Taskflow is ACCOUNT-BASED, not guest-first: a task manager needs a signed-in
 * identity to own projects, be assigned tasks, and sync across devices. Every
 * data model is owner-scoped (allow.owner(), userPool) — there is no guest read
 * path. See the CLAUDE.md "account-based" decision.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
