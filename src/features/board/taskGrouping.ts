import type { SectionRecord, TaskRecord } from '../../lib/dataClient';

export interface Column {
  section: SectionRecord;
  tasks: TaskRecord[];
}

/** Group top-level tasks under their sections for the board/list view. Sections
 * come pre-sorted by sortOrder; within a column tasks sort by their own
 * sortOrder. Subtasks (parentTaskId set) are excluded — they render inside a
 * task, not as board cards. Tasks whose sectionId matches no column are dropped
 * onto the first column so nothing goes missing. Pure + total. */
export function groupTasksBySection(sections: SectionRecord[], tasks: TaskRecord[]): Column[] {
  const columns: Column[] = sections.map((section) => ({ section, tasks: [] }));
  const byId = new Map(columns.map((c) => [c.section.id, c]));
  for (const task of tasks) {
    if (task.parentTaskId) continue;
    const target = (task.sectionId && byId.get(task.sectionId)) || columns[0];
    if (target) target.tasks.push(task);
  }
  for (const col of columns) {
    col.tasks.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }
  return columns;
}
