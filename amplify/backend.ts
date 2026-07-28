import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

/**
 * Taskflow backend.
 *
 * A straightforward Gen2 backend: Cognito auth + AppSync/DynamoDB data. Every
 * model is owner-scoped (userPool), so there are no cross-user IAM grants,
 * generation Lambdas, or storage buckets to wire — the whole app is CRUD over
 * the owner's own rows. This file is DECLARATIVE (gate-exempt); add resource
 * grants here if a future slice needs a Lambda.
 */
defineBackend({
  auth,
  data,
});
