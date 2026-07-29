/** Deterministic seed data for a demo workspace — declarative (gate-exempt).
 * The e2e acceptance suite asserts on these exact names, so they must stay
 * stable. `dueOffsetDays` is resolved to a real date at seed time (negative =
 * overdue) so the My Tasks buckets always have an Overdue + Upcoming example. */
export interface SeedTask {
  title: string;
  section: string;
  priority: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  dueOffsetDays?: number;
  notes?: string;
  subtasks?: string[];
  /** Names of labels (from seedLabels) to apply to this task. */
  labels?: string[];
}

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
    ],
  },
  {
    name: 'Personal',
    color: 'emerald',
    sections: ['To do', 'Doing', 'Done'],
    tasks: [
      { title: 'Plan Q3 goals', section: 'To do', priority: 'MEDIUM', dueOffsetDays: 5 },
      { title: 'Renew passport', section: 'To do', priority: 'HIGH', dueOffsetDays: -1 },
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
  {
    name: 'Scratchpad',
    color: 'violet',
    sections: ['To do'],
    tasks: [{ title: 'Random idea', section: 'To do', priority: 'NONE' }],
  },
];
