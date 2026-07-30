/** Asana-style project health statuses and their display metadata. Pure — the
 * one place that maps a status enum to its label + color token, so the header
 * pill, the card pill, and the picker all stay in sync. */
export type ProjectStatus = 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK';

export interface StatusMeta {
  value: ProjectStatus;
  label: string;
  /** CSS var name (without `var()`) driving the pill accent. */
  colorVar: string;
}

export const STATUS_META: readonly StatusMeta[] = [
  { value: 'ON_TRACK', label: 'On track', colorVar: '--tf-done' },
  { value: 'AT_RISK', label: 'At risk', colorVar: '--tf-priority-medium' },
  { value: 'OFF_TRACK', label: 'Off track', colorVar: '--tf-danger' },
] as const;

/** Look up a status's display metadata, or null for "no status set". */
export function statusMeta(status: string | null | undefined): StatusMeta | null {
  return STATUS_META.find((m) => m.value === status) ?? null;
}
