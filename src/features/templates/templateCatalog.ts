/** Project templates — declarative starting points a user can spin up in one
 * tap. Pure data + lookup so the picker and the create flow share one source. */
export interface ProjectTemplate {
  key: string;
  name: string;
  color: string;
  description: string;
  sections: string[];
  /** Starter tasks: title + which section (by name) they land in. */
  tasks: { title: string; section: string }[];
}

export const TEMPLATES: ProjectTemplate[] = [
  {
    key: 'sprint',
    name: 'Sprint',
    color: 'indigo',
    description: 'A two-week engineering sprint board.',
    sections: ['Backlog', 'In progress', 'Review', 'Done'],
    tasks: [
      { title: 'Sprint planning', section: 'Backlog' },
      { title: 'Daily standup', section: 'In progress' },
      { title: 'Sprint retro', section: 'Backlog' },
    ],
  },
  {
    key: 'content',
    name: 'Content calendar',
    color: 'rose',
    description: 'Plan and ship content from idea to published.',
    sections: ['Ideas', 'Drafting', 'Editing', 'Published'],
    tasks: [
      { title: 'Brainstorm topics', section: 'Ideas' },
      { title: 'Outline next post', section: 'Drafting' },
    ],
  },
  {
    key: 'launch',
    name: 'Product launch',
    color: 'emerald',
    description: 'Coordinate everything for a launch.',
    sections: ['To do', 'In progress', 'Done'],
    tasks: [
      { title: 'Define launch goals', section: 'To do' },
      { title: 'Draft announcement', section: 'To do' },
      { title: 'Line up press', section: 'To do' },
    ],
  },
];

/** Look up a template by key. */
export function templateByKey(key: string): ProjectTemplate | undefined {
  return TEMPLATES.find((t) => t.key === key);
}
