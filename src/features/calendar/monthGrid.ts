import type { TaskRecord } from '../../lib/dataClient';
import { isDone } from '../task/taskMeta';
import { horizonDates } from './horizon';

export interface MonthCell {
  /** YYYY-MM-DD. */
  date: string;
  /** Day-of-month number shown in the cell. */
  day: number;
  /** True when the date belongs to the anchored month (else a spill-over day). */
  inMonth: boolean;
  isToday: boolean;
  tasks: TaskRecord[];
}
export type MonthWeek = MonthCell[];

const MONTHS =
  'January February March April May June July August September October November December'.split(
    ' ',
  );

/** "August 2026" for a 1-based month. */
export function monthLabel(year: number, month: number): string {
  return `${MONTHS[month - 1]} ${year}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Build a Sunday-first week matrix for the given 1-based month, each cell
 * carrying that day's OPEN, dated tasks (sorted by title). Leading/trailing
 * spill-over days from the neighbouring months fill the first/last weeks so the
 * grid is always rectangular. Pure — `today` injected for determinism. */
export function monthMatrix(
  year: number,
  month: number,
  today: string,
  tasks: TaskRecord[],
): MonthWeek[] {
  const firstDow = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const weeks = Math.ceil((firstDow + daysInMonth(year, month)) / 7);
  const start = new Date(Date.UTC(year, month - 1, 1 - firstDow)).toISOString().slice(0, 10);
  const dates = horizonDates(start, weeks * 7);

  const byDate = new Map<string, TaskRecord[]>();
  for (const task of tasks) {
    if (isDone(task) || !task.dueDate) continue;
    if (!byDate.has(task.dueDate)) byDate.set(task.dueDate, []);
    byDate.get(task.dueDate)!.push(task);
  }

  const cells: MonthCell[] = dates.map((date) => {
    const [, m, d] = date.split('-').map(Number);
    return {
      date,
      day: d,
      inMonth: m === month,
      isToday: date === today,
      tasks: (byDate.get(date) ?? []).sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '')),
    };
  });

  const out: MonthWeek[] = [];
  for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
  return out;
}
