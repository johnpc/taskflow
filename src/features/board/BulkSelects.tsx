import { PRIORITY_META, type Priority } from '../task/taskMeta';
import type { SectionRecord } from '../../lib/dataClient';

const PRIORITIES: Priority[] = ['NONE', 'LOW', 'MEDIUM', 'HIGH'];

/** The bulk dropdowns in the selection bar: move-to-section, assign-to-member,
 * and set-priority. Each fires its handler on change; assign + priority render
 * only when their handler is given. Split from SelectionBar for the line limit. */
export function BulkSelects({
  sections,
  members = [],
  onMove,
  onAssign,
  onPriority,
}: {
  sections: SectionRecord[];
  members?: string[];
  onMove: (sectionId: string) => void;
  onAssign?: (email: string | null) => void;
  onPriority?: (priority: Priority) => void;
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
    </>
  );
}
