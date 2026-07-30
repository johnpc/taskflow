import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * Taskflow data schema — an Asana-style project & task manager.
 *
 * Taskflow is ACCOUNT-BASED with PER-PROJECT SHARING: every project-scoped model
 * carries a `members` string[] (emails) and authorizes via
 * allow.ownersDefinedIn('members').identityClaim('email') — so every member of a
 * project has full read/write on its sections/tasks/comments/attachments. The
 * creator is added to members on create; invites append (and cascade the array
 * to child records). Labels remain a personal owner-scoped registry. There is no
 * guest read path. Read/write everything with authMode 'userPool'; the seed signs
 * in as the test user. See CLAUDE.md decisions.
 *
 * Shape (grows one vertical slice at a time):
 * - Project   — a board/list of work (name, color, view, archived).
 * - Section   — a named column/group within a project (kanban columns or list
 *               groupings), ordered by sortOrder.
 * - Task      — the unit of work: title, notes, status, priority, dueDate,
 *               assignee, ordered within its section. Subtasks self-reference
 *               via parentTaskId.
 * - Comment   — an activity/discussion entry on a task.
 * - Label     — a reusable colored tag; a task carries denormalized labelIds[].
 */
const schema = a.schema({
  // A project: a board or list of work the owner is driving. Tasks denormalize
  // projectId so the board read is a single by-project GSI query.
  Project: a
    .model({
      name: a.string().required(),
      description: a.string(),
      // Brand palette key (see gameCatalog-style catalog); drives the accent dot.
      color: a.string(),
      // Default view when the project opens.
      view: a.enum(['BOARD', 'LIST']),
      sortOrder: a.integer().default(0),
      isArchived: a.boolean().default(false),
      favorite: a.boolean().default(false),
      // Per-project sharing: the emails of everyone with access (the creator is
      // added on create; invites append). Every model in the project mirrors
      // this list so AppSync per-record owner auth grants each member access.
      members: a.string().array(),
      sections: a.hasMany('Section', 'projectId'),
      tasks: a.hasMany('Task', 'projectId'),
    })
    .authorization((allow) => [allow.ownersDefinedIn('members').identityClaim('email')]),

  // A named column (Board view) / group (List view) within a project. Tasks
  // belong to exactly one section; sortOrder positions columns left→right.
  Section: a
    .model({
      projectId: a.id().required(),
      project: a.belongsTo('Project', 'projectId'),
      name: a.string().required(),
      sortOrder: a.integer().default(0),
      // Mirrors the parent project's members (see Project.members).
      members: a.string().array(),
      tasks: a.hasMany('Task', 'sectionId'),
    })
    // Read all sections for a project, ordered — the board/list read path.
    .secondaryIndexes((index) => [index('projectId').sortKeys(['sortOrder'])])
    .authorization((allow) => [allow.ownersDefinedIn('members').identityClaim('email')]),

  // The unit of work. Ordered within its section by sortOrder (drag reorders).
  // Subtasks self-reference the parent via parentTaskId. assigneeEmail carries
  // the assignee (self, in the single-user model; ready for sharing later).
  Task: a
    .model({
      projectId: a.id().required(),
      project: a.belongsTo('Project', 'projectId'),
      sectionId: a.id(),
      section: a.belongsTo('Section', 'sectionId'),
      title: a.string().required(),
      notes: a.string(),
      status: a.enum(['TODO', 'IN_PROGRESS', 'DONE']),
      priority: a.enum(['NONE', 'LOW', 'MEDIUM', 'HIGH']),
      // Optional start date — when work should begin, on or before the due date.
      // A future start marks the task "not started yet" (a card cue).
      startDate: a.date(),
      // A milestone is a key checkpoint (shown with a ◆ marker), not regular work.
      isMilestone: a.boolean(),
      // Optional highlight color (a --tf-proj-* palette key) — a left accent
      // stripe on the card for visual grouping. Null = no highlight.
      color: a.string(),
      dueDate: a.date(),
      // Optional time-of-day for the due date (HH:MM, 24h). A display refinement
      // on top of the date — bucketing (overdue/today/upcoming) stays date-level.
      dueTime: a.string(),
      // Recurrence: when set (and the task has a due date), completing the task
      // spawns the next occurrence with the due date advanced by this period.
      repeat: a.enum(['NONE', 'DAILY', 'WEEKLY', 'MONTHLY']),
      // My Tasks focus plan: a manual Today/Upcoming/Later bucket, independent of
      // the due date — for organizing "what I'll work on" across projects.
      myBucket: a.enum(['NONE', 'TODAY', 'UPCOMING', 'LATER']),
      completedAt: a.datetime(),
      sortOrder: a.integer().default(0),
      assigneeEmail: a.string(),
      // Denormalized reusable-label ids (see Label). Kept on the task so the
      // board renders chips without a per-task join.
      labelIds: a.string().array(),
      // Custom-field values: a denormalized { [customFieldId]: string } map,
      // stored as a JSON STRING (a.json()'s AWSJSON variable rejects a raw object
      // on update — a string round-trips cleanly). Parsed by readCustomValues.
      customValues: a.string(),
      // Task dependencies: ids of same-project tasks that must finish first.
      // Denormalized (like labelIds) so the board can flag "Blocked" without a
      // join — it already holds every task in the project.
      blockedByIds: a.string().array(),
      // Subtasks: a task can have a parent task (self-relation).
      parentTaskId: a.id(),
      parent: a.belongsTo('Task', 'parentTaskId'),
      subtasks: a.hasMany('Task', 'parentTaskId'),
      comments: a.hasMany('Comment', 'taskId'),
      attachments: a.hasMany('Attachment', 'taskId'),
      // Mirrors the parent project's members (see Project.members).
      members: a.string().array(),
    })
    // Board read path: all tasks in a project, then group by section client-side
    // on the bounded page. Subtask read path: children of a parent task.
    .secondaryIndexes((index) => [
      index('projectId').sortKeys(['sortOrder']),
      index('parentTaskId'),
    ])
    .authorization((allow) => [allow.ownersDefinedIn('members').identityClaim('email')]),

  // An activity/discussion entry on a task. authorEmail is denormalized so the
  // thread renders without a user lookup. Ordered by createdAt (the model's
  // built-in timestamp) on the bounded page.
  Comment: a
    .model({
      taskId: a.id().required(),
      task: a.belongsTo('Task', 'taskId'),
      body: a.string().required(),
      authorEmail: a.string(),
      // Mirrors the task's project members so every collaborator sees the thread.
      members: a.string().array(),
    })
    // Read all comments for a task.
    .secondaryIndexes((index) => [index('taskId')])
    .authorization((allow) => [allow.ownersDefinedIn('members').identityClaim('email')]),

  // A link attached to a task (a named URL). No file uploads — this is a
  // links-only v1; the url is safeHref-guarded before render. Ordered by
  // createdAt on the bounded per-task page.
  Attachment: a
    .model({
      taskId: a.id().required(),
      task: a.belongsTo('Task', 'taskId'),
      url: a.string().required(),
      title: a.string(),
      // Mirrors the task's project members so every collaborator sees the link.
      members: a.string().array(),
    })
    .secondaryIndexes((index) => [index('taskId')])
    .authorization((allow) => [allow.ownersDefinedIn('members').identityClaim('email')]),

  // A reusable colored tag. Tasks carry denormalized labelIds[] referencing
  // these; the label registry gives each id a name + color. Labels stay a
  // PERSONAL registry (owner-scoped) — shared-project label chips resolving for
  // every member is a follow-up; not needed for the sharing foundation.
  Label: a
    .model({
      name: a.string().required(),
      color: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  // A project-defined custom field (Asana-style). v1 is TEXT only; tasks store
  // values in their denormalized customValues map keyed by this field's id.
  // Member-scoped like the rest of the project (mirrors Project.members).
  CustomField: a
    .model({
      projectId: a.id().required(),
      name: a.string().required(),
      fieldType: a.enum(['TEXT', 'SELECT', 'NUMBER', 'DATE']),
      // For SELECT fields: the allowed option labels (ignored for other types).
      options: a.string().array(),
      sortOrder: a.integer().default(0),
      members: a.string().array(),
    })
    .secondaryIndexes((index) => [index('projectId')])
    .authorization((allow) => [allow.ownersDefinedIn('members').identityClaim('email')]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
