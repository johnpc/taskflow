import { defineBackend } from '@aws-amplify/backend';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { preTokenGeneration } from './auth/pre-token-generation/resource';
import { data } from './data/resource';

/**
 * Taskflow backend.
 *
 * Cognito auth + AppSync/DynamoDB data with per-project sharing (member-scoped
 * models). The pre-token-generation trigger must fire as the V2 event so it can
 * edit the ACCESS token (V1 can only edit the ID token); AppSync reads the
 * access token for email-based member auth. defineAuth wires the trigger as V1
 * by default, so here we switch the user pool's LambdaConfig to the V2 config
 * field, reusing the same Lambda ARN. This file is DECLARATIVE (gate-exempt).
 */
const backend = defineBackend({
  auth,
  preTokenGeneration,
  data,
});

const fn = backend.preTokenGeneration.resources.lambda;
const userPool = backend.auth.resources.userPool;
backend.auth.resources.cfnResources.cfnUserPool.lambdaConfig = {
  preTokenGenerationConfig: { lambdaArn: fn.functionArn, lambdaVersion: 'V2_0' },
};
// Wiring the trigger via the escape hatch (not auth.triggers) skips the
// auto-added invoke permission — grant Cognito permission to call the Lambda.
fn.addPermission('CognitoPreTokenGen', {
  principal: new ServicePrincipal('cognito-idp.amazonaws.com'),
  sourceArn: userPool.userPoolArn,
});
