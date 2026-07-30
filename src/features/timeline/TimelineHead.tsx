import type { CSSProperties } from 'react';

/** The timeline's day-header row. Each cell marks today and is a drop target so
 * a dragged bar can be rescheduled onto that day. Presentational; drop is
 * delegated up. */
export function TimelineHead({
  days,
  today,
  cols,
  onDropOnDay,
}: {
  days: string[];
  today: string;
  cols: CSSProperties;
  onDropOnDay: (date: string) => void;
}) {
  return (
    <div className="timeline__head" style={cols}>
      {days.map((d) => (
        <span
          key={d}
          className={d === today ? 'timeline__day timeline__day--today' : 'timeline__day'}
          data-testid={d === today ? 'timeline-today' : `timeline-day-${d}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDropOnDay(d)}
        >
          {d === today ? 'Today' : Number(d.slice(8, 10))}
        </span>
      ))}
    </div>
  );
}
