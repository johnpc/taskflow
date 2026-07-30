/** Deterministic seed data for a demo workspace — declarative (gate-exempt).
 * The e2e acceptance suite asserts on these exact names, so they must stay
 * stable. `dueOffsetDays` is resolved to a real date at seed time (negative =
 * overdue) so the My Tasks buckets always have an Overdue + Upcoming example. */
export interface SeedTask {
  title: string;
  section: string;
  priority: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  dueOffsetDays?: number;
  /** Start date as a day offset from today (positive = starts in the future). */
  startOffsetDays?: number;
  notes?: string;
  subtasks?: string[];
  /** Names of labels (from seedLabels) to apply to this task. */
  labels?: string[];
  /** Titles of other tasks in the SAME project that must finish first. */
  blockedBy?: string[];
  /** Recurrence rule; completing a recurring task spawns the next occurrence. */
  repeat?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  /** Mark this task a milestone (a key checkpoint, shown with a ◆ marker). */
  isMilestone?: boolean;
  /** Seed this task already completed (for progress/completed acceptance). */
  done?: boolean;
  /** Assign this task to the seed user (for the assigned-to-me acceptance). */
  assigned?: boolean;
  /** Assign this task to a specific email — must be one of the project's members
   * (for the shared-project assignee-filter acceptance). */
  assignedTo?: string;
}

/** A stable non-seed-user teammate email used for shared-project seed fixtures.
 * The user needn't exist in Cognito to appear as a member/assignee option. */
export const SEED_TEAMMATE = 'teammate@example.com';

/** Reusable label registry — name + color key (a --tf-proj-* palette key). */
export const seedLabels: { name: string; color: string }[] = [
  { name: 'Marketing', color: 'rose' },
  { name: 'Design', color: 'violet' },
  { name: 'Urgent', color: 'amber' },
  { name: 'Backend', color: 'sky' },
];

export interface SeedProject {
  name: string;
  color: string;
  favorite?: boolean;
  /** Seed this project already archived (for the archived-projects view). */
  archived?: boolean;
  /** Extra member emails beyond the seed user (makes the project SHARED, so the
   * assignee filter renders + tasks can be assigned to a teammate). */
  extraMembers?: string[];
  sections: string[];
  tasks: SeedTask[];
}

export const seedProjects: SeedProject[] = [
  {
    name: 'Product Launch',
    color: 'indigo',
    favorite: true,
    sections: ['To do', 'In progress', 'Done'],
    tasks: [
      {
        title: 'Draft launch announcement',
        section: 'To do',
        priority: 'HIGH',
        dueOffsetDays: -2,
        notes: 'Blog post + email + social.',
        subtasks: ['Outline key points', 'Write first draft'],
        labels: ['Marketing', 'Urgent'],
      },
      { title: 'Design hero banner', section: 'To do', priority: 'MEDIUM', dueOffsetDays: 3 },
      // Stable dependency anchor: blocked by the (never-completed) hero banner,
      // so the "Blocked by" banner is always present for the deps acceptance.
      {
        title: 'Announce on socials',
        section: 'To do',
        priority: 'LOW',
        blockedBy: ['Design hero banner'],
      },
      { title: 'Set up analytics', section: 'In progress', priority: 'LOW', dueOffsetDays: 1 },
      { title: 'Reserve launch domain', section: 'Done', priority: 'NONE' },
      // Stable anchor: NO acceptance scenario ever completes/moves this, so
      // cross-area "is visible" assertions stay valid on the shared sandbox even
      // as parallel areas mutate other tasks (hide-completed is default-on).
      {
        title: 'Finalize press list',
        section: 'To do',
        priority: 'MEDIUM',
        labels: ['Marketing'],
        notes:
          'Confirm **embargo** date and the [press kit](https://example.com/kit).\n[ ] Draft outreach\n[x] Build the list',
      },
      // Dedicated completion targets — each is completed by exactly ONE
      // acceptance area (board, filter) and read by no other, so completing it
      // (which hides it) can't break a parallel area on the shared sandbox.
      { title: 'Kickoff meeting', section: 'To do', priority: 'LOW' },
      { title: 'Ship changelog', section: 'To do', priority: 'LOW' },
      { title: 'Retire old logo', section: 'To do', priority: 'LOW' },
      { title: 'Archive Q1 notes', section: 'To do', priority: 'LOW' },
      { title: 'Rename me', section: 'To do', priority: 'LOW' },
      { title: 'Bulk one', section: 'To do', priority: 'LOW' },
      { title: 'Bulk two', section: 'To do', priority: 'LOW' },
      { title: 'Drag me', section: 'To do', priority: 'LOW' },
      { title: 'Undo me', section: 'To do', priority: 'LOW' },
      // Weekly recurring COMPLETION target (spawns next occurrence when done).
      {
        title: 'Weekly sync',
        section: 'To do',
        priority: 'LOW',
        dueOffsetDays: 2,
        repeat: 'WEEKLY',
      },
      // Daily recurring READ-ONLY anchor (never completed) for the repeat-badge check.
      {
        title: 'Daily standup',
        section: 'To do',
        priority: 'LOW',
        dueOffsetDays: 1,
        repeat: 'DAILY',
      },
      // Dedicated due-time target: already has a date, so the time input is
      // enabled; only the due-time area sets its time.
      { title: 'Timed review', section: 'To do', priority: 'LOW', dueOffsetDays: 4 },
      // Future-start READ-ONLY anchor: starts in 5 days, so its card always
      // shows the "Starts …" chip for the start-date acceptance.
      {
        title: 'Prep offsite',
        section: 'To do',
        priority: 'LOW',
        startOffsetDays: 5,
        dueOffsetDays: 12,
      },
      // Read-only milestone anchor: its card always shows the ◆ marker.
      { title: 'Launch day', section: 'To do', priority: 'HIGH', isMilestone: true },
      // Dedicated duplicate target: only the duplicate area copies it.
      { title: 'Clone me', section: 'To do', priority: 'MEDIUM' },
      // Dedicated highlight-color target: only the color area sets its color.
      { title: 'Color me', section: 'To do', priority: 'LOW' },
      // Dedicated comment target: only the comment-delete area posts here.
      { title: 'Comment me', section: 'To do', priority: 'LOW' },
      // Read-only subtask-chip anchor: 2 open subtasks, so its card shows "0/2".
      // No other area touches it (unlike Draft launch, whose subtasks the task
      // area mutates).
      {
        title: 'Chip parent',
        section: 'To do',
        priority: 'LOW',
        subtasks: ['Chip sub one', 'Chip sub two'],
      },
      // Read-only search-project-filter anchor: the unique token "Zephyr"
      // appears in exactly two projects (here + Website Redesign), so a search
      // returns both and picking one project narrows to a single hit.
      { title: 'Zephyr report', section: 'To do', priority: 'LOW' },
      // Read-only list-columns anchor: a HIGH-priority task no area ever mutates,
      // so the list Priority-column assertion is stable (unlike "Finalize press
      // list", whose priority the quickedit area cycles MEDIUM→HIGH).
      { title: 'Column check', section: 'To do', priority: 'HIGH' },
      // Dedicated completion target for the celebration area: completing it on a
      // freshly-loaded board is the session's FIRST completion → fires confetti.
      { title: 'Celebrate me', section: 'To do', priority: 'LOW' },
    ],
  },
  {
    name: 'Website Redesign',
    color: 'sky',
    sections: ['Backlog', 'This week', 'Shipped'],
    tasks: [
      { title: 'Audit current pages', section: 'Backlog', priority: 'MEDIUM' },
      { title: 'New nav prototype', section: 'This week', priority: 'HIGH', dueOffsetDays: 0 },
      { title: 'Migrate blog', section: 'Backlog', priority: 'LOW', dueOffsetDays: 10 },
      // Second "Zephyr" anchor for the search-project-filter scenario.
      { title: 'Zephyr report', section: 'Backlog', priority: 'LOW' },
    ],
  },
  {
    name: 'Personal',
    color: 'emerald',
    sections: ['To do', 'Doing', 'Done'],
    tasks: [
      { title: 'Plan Q3 goals', section: 'To do', priority: 'MEDIUM', dueOffsetDays: 5 },
      { title: 'Renew passport', section: 'To do', priority: 'HIGH', dueOffsetDays: -1 },
      // Assigned-to-me anchor: the only seed task assigned to the seed user, so
      // My Tasks' "Assigned to me" filter narrows down to exactly this one.
      { title: 'My assigned task', section: 'To do', priority: 'LOW', assigned: true },
    ],
  },
  // Dedicated throwaway projects for the archive + delete acceptance scenarios,
  // each mutated by exactly one area so they can't disturb the others.
  {
    name: 'Old Campaign',
    color: 'amber',
    sections: ['To do', 'Done'],
    tasks: [{ title: 'Wrap up', section: 'To do', priority: 'LOW' }],
  },
  // Dedicated project for the sharing (members) area: only that area invites +
  // removes a teammate here, so its member list can't disturb a parallel run.
  {
    name: 'Share Lab',
    color: 'sky',
    sections: ['To do'],
    tasks: [{ title: 'Shared task', section: 'To do', priority: 'LOW' }],
  },
  // Dedicated SHARED project for the assignee-filter area: seed user + a teammate
  // as members, with one task assigned to each. The assignee filter renders
  // (>1 member) and narrowing to the teammate leaves only their task.
  {
    name: 'Team Board',
    color: 'emerald',
    extraMembers: [SEED_TEAMMATE],
    sections: ['To do'],
    tasks: [
      { title: 'Teammate task', section: 'To do', priority: 'LOW', assignedTo: SEED_TEAMMATE },
      { title: 'Owner task', section: 'To do', priority: 'LOW', assigned: true },
    ],
  },
  // Dedicated project for the custom-fields area: only that area defines a field
  // + sets its value here, so the created field can't disturb a parallel run.
  {
    name: 'Fields Lab',
    color: 'amber',
    sections: ['To do'],
    tasks: [{ title: 'Field target', section: 'To do', priority: 'LOW' }],
  },
  {
    name: 'Scratchpad',
    color: 'violet',
    sections: ['To do'],
    tasks: [{ title: 'Random idea', section: 'To do', priority: 'NONE' }],
  },
  // Dedicated project for drag-to-reorder: two ordered cards only this area
  // touches, so reordering them can't disturb a parallel run.
  {
    name: 'Reorder Lab',
    color: 'rose',
    sections: ['Queue'],
    tasks: [
      { title: 'Order alpha', section: 'Queue', priority: 'LOW' },
      { title: 'Order bravo', section: 'Queue', priority: 'LOW' },
    ],
  },
  // Dedicated project with a fixed 1-of-2 done ratio for the progress-bar
  // acceptance — read-only, so its 50% stays stable on the shared sandbox.
  {
    name: 'Progress Lab',
    color: 'emerald',
    sections: ['Tasks'],
    tasks: [
      { title: 'Progress done', section: 'Tasks', priority: 'LOW', done: true },
      { title: 'Progress open', section: 'Tasks', priority: 'LOW' },
    ],
  },
  // Pre-archived project for the archived-projects view: it starts in the
  // Archived section (a pure read), so the acceptance never has to archive it
  // first — keeping the scenario idempotent across CI retries.
  {
    name: 'Archive Lab',
    color: 'sky',
    archived: true,
    sections: ['To do'],
    tasks: [{ title: 'Archived work', section: 'To do', priority: 'LOW' }],
  },
  // Dedicated source + target for the move-to-project round-trip. Only that
  // area moves "Movable task" from Move From into Move To.
  {
    name: 'Move From',
    color: 'violet',
    sections: ['To do'],
    tasks: [{ title: 'Movable task', section: 'To do', priority: 'LOW' }],
  },
  {
    name: 'Move To',
    color: 'amber',
    sections: ['Inbox'],
    tasks: [{ title: 'Move To anchor', section: 'Inbox', priority: 'LOW' }],
  },
  // Dedicated project for the persist-collapse round-trip — only that area
  // collapses its section, so the persisted state can't disturb a parallel run.
  {
    name: 'Collapse Lab',
    color: 'indigo',
    sections: ['Backlog'],
    tasks: [{ title: 'Collapse me', section: 'Backlog', priority: 'LOW' }],
  },
  // Dedicated project for the bulk-move round-trip: two tasks in Stage that
  // only this area selects + moves to Shipped.
  {
    name: 'Bulk Move Lab',
    color: 'sky',
    sections: ['Stage', 'Shipped'],
    tasks: [
      { title: 'Bulk move one', section: 'Stage', priority: 'LOW' },
      { title: 'Bulk move two', section: 'Stage', priority: 'LOW' },
    ],
  },
];
