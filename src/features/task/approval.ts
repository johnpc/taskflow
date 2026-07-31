/** Approval outcome metadata (Asana approvals). A task's `approval` is NONE for
 * a regular task, or one of three outcomes shown as a colored badge + picker.
 * Pure — the label + palette var per status, and the option list for the picker. */

export type Approval = 'NONE' | 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED';

export interface ApprovalMeta {
  label: string;
  /** A --tf-* CSS variable name for the badge color. */
  colorVar: string;
}

const META: Record<Exclude<Approval, 'NONE'>, ApprovalMeta> = {
  APPROVED: { label: 'Approved', colorVar: '--tf-done' },
  CHANGES_REQUESTED: { label: 'Changes requested', colorVar: '--tf-priority-medium' },
  REJECTED: { label: 'Rejected', colorVar: '--tf-danger' },
};

/** The badge label + color for an approval outcome, or null for NONE/unset. */
export function approvalMeta(approval: Approval | null | undefined): ApprovalMeta | null {
  if (!approval || approval === 'NONE') return null;
  return META[approval];
}

/** Normalize a possibly-null field to a concrete Approval. */
export function approvalOf(approval: Approval | null | undefined): Approval {
  return approval ?? 'NONE';
}

/** Options for the approval picker, in display order (No approval first). */
export const APPROVAL_OPTIONS: { value: Approval; label: string }[] = [
  { value: 'NONE', label: 'No approval' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'CHANGES_REQUESTED', label: 'Changes requested' },
  { value: 'REJECTED', label: 'Rejected' },
];
