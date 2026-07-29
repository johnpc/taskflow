import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * Taskflow data schema — an Asana-style project & task manager.
 *
 * Taskflow is ACCOUNT-BASED and owner-scoped: every model uses allow.owner()
 * (userPool), so a signed-in user only ever reads and writes their own rows.
 * There is no guest read path (unlike the spork reference) — a task manager
 * needs an identity to own work. Read/write everything with authMode
 * 'userPool'; the seed signs in as the test user. See CLAUDE.md decisions.
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
      sections: a.hasMany('Section', 'projectId'),
      tasks: a.hasMany('Task', 'projectId'),
    })
    .authorization((allow) => [allow.owner()]),

  // A named column (Board view) / group (List view) within a project. Tasks
  // belong to exactly one section; sortOrder positions columns left→right.
  Section: a
    .model({
      projectId: a.id().required(),
      project: a.belongsTo('Project', 'projectId'),
      name: a.string().required(),
      sortOrder: a.integer().default(0),
      tasks: a.hasMany('Task', 'sectionId'),
    })
    // Read all sections for a project, ordered — the board/list read path.
    .secondaryIndexes((index) => [index('projectId').sortKeys(['sortOrder'])])
    .authorization((allow) => [allow.owner()]),

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
    })
    // Board read path: all tasks in a project, then group by section client-side
    // on the bounded page. Subtask read path: children of a parent task.
    .secondaryIndexes((index) => [
      index('projectId').sortKeys(['sortOrder']),
      index('parentTaskId'),
    ])
    .authorization((allow) => [allow.owner()]),

  // An activity/discussion entry on a task. authorEmail is denormalized so the
  // thread renders without a user lookup. Ordered by createdAt (the model's
  // built-in timestamp) on the bounded page.
  Comment: a
    .model({
      taskId: a.id().required(),
      task: a.belongsTo('Task', 'taskId'),
      body: a.string().required(),
      authorEmail: a.string(),
    })
    // Read all comments for a task.
    .secondaryIndexes((index) => [index('taskId')])
    .authorization((allow) => [allow.owner()]),

  // A link attached to a task (a named URL). No file uploads — this is a
  // links-only v1; the url is safeHref-guarded before render. Ordered by
  // createdAt on the bounded per-task page.
  Attachment: a
    .model({
      taskId: a.id().required(),
      task: a.belongsTo('Task', 'taskId'),
      url: a.string().required(),
      title: a.string(),
    })
    .secondaryIndexes((index) => [index('taskId')])
    .authorization((allow) => [allow.owner()]),

  // A reusable colored tag. Tasks carry denormalized labelIds[] referencing
  // these; the label registry gives each id a name + color.
  Label: a
    .model({
      name: a.string().required(),
      color: a.string(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
