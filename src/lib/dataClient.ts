/**
 * Shared Amplify Data client (typed against the backend Schema).
 *
 * Taskflow is account-based and owner-scoped: every model uses allow.owner()
 * (userPool), so the client fixes authMode to 'userPool'. A signed-in user only
 * ever reads/writes their own rows. (Unlike the guest-first spork reference,
 * there is no identityPool read path — see CLAUDE.md decisions.)
 */
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

export const dataClient = generateClient<Schema>({ authMode: 'userPool' });

export type ProjectRecord = Schema['Project']['type'];
export type SectionRecord = Schema['Section']['type'];
export type TaskRecord = Schema['Task']['type'];
export type CommentRecord = Schema['Comment']['type'];
export type AttachmentRecord = Schema['Attachment']['type'];
export type LabelRecord = Schema['Label']['type'];
export type CustomFieldRecord = Schema['CustomField']['type'];
export type StatusUpdateRecord = Schema['StatusUpdate']['type'];
export type ProjectResourceRecord = Schema['ProjectResource']['type'];
