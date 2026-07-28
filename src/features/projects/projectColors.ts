/** Project accent palette. Each key maps to a --tf-proj-* token (variables.css);
 * a project stores the KEY in Project.color and the UI resolves the CSS var.
 * Pure data + lookup so it's shared by the picker, the card, and the board. */
export const PROJECT_COLORS = ['indigo', 'emerald', 'amber', 'rose', 'sky', 'violet'] as const;

export type ProjectColor = (typeof PROJECT_COLORS)[number];

const DEFAULT: ProjectColor = 'indigo';

/** Normalize a stored color to a known key (defaults when null/unknown). */
export function toProjectColor(value: string | null | undefined): ProjectColor {
  return PROJECT_COLORS.includes(value as ProjectColor) ? (value as ProjectColor) : DEFAULT;
}

/** The CSS custom-property reference for a project color, e.g. var(--tf-proj-sky). */
export function projectColorVar(value: string | null | undefined): string {
  return `var(--tf-proj-${toProjectColor(value)})`;
}

/** Deterministically pick a color for a new project from its creation order, so
 * a fresh workspace gets a varied palette without asking the user. */
export function nextProjectColor(existingCount: number): ProjectColor {
  return PROJECT_COLORS[existingCount % PROJECT_COLORS.length];
}
