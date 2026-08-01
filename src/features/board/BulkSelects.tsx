import { PRIORITY_META, type Priority } from '../task/taskMeta';
import type { LabelRecord, SectionRecord } from '../../lib/dataClient';

const PRIORITIES: Priority[] = ['NONE', 'LOW', 'MEDIUM', 'HIGH'];

/** The bulk dropdowns in the selection bar: move-to-section, assign-to-member,
 * set-priority, and add-label. Each fires its handler on change; assign /
 * priority / label render only when their handler (+ options) is given. Split
 * from SelectionBar for the line limit. */
export function BulkSelects({
  sections,
  members = [],
  labels = [],
  onMove,
  onAssign,
  onPriority,
  onLabel,
}: {
  sections: SectionRecord[];
  members?: string[];
  labels?: LabelRecord[];
  onMove: (sectionId: string) => void;
  onAssign?: (email: string | null) => void;
  onPriority?: (priority: Priority) => void;
  onLabel?: (labelId: string) => void;
}) {
  return (
    <>
      <select
        className="selection-bar__move"
        data-testid="bulk-move"
        aria-label="Move selected to section"
        value=""
        onChange={(e) => e.target.value && onMove(e.target.value)}
      >
        <option value="">Move to…</option>
        {sections.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      {onAssign && (
        <select
          className="selection-bar__move"
          data-testid="bulk-assign"
          aria-label="Assign selected to"
          value=""
          onChange={(e) => onAssign(e.target.value || null)}
        >
          <option value="">Assign to…</option>
          {members.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      )}
      {onPriority && (
        <select
          className="selection-bar__move"
          data-testid="bulk-priority"
          aria-label="Set priority of selected"
          value=""
          onChange={(e) => e.target.value && onPriority(e.target.value as Priority)}
        >
          <option value="">Priority…</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p === 'NONE' ? 'No priority' : PRIORITY_META[p].label}
            </option>
          ))}
        </select>
      )}
      {onLabel && labels.length > 0 && (
        <select
          className="selection-bar__move"
          data-testid="bulk-label"
          aria-label="Add label to selected"
          value=""
          onChange={(e) => e.target.value && onLabel(e.target.value)}
        >
          <option value="">Add label…</option>
          {labels.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      )}
    </>
  );
}
