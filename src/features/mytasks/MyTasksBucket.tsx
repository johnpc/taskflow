import { TaskCard } from '../task/TaskCard';
import { FocusBucketPicker } from './FocusBucketPicker';
import { nowISO } from '../task/today';
import type { TaskBucket } from './groupByDue';
import type { FocusBucket } from './groupByFocus';

/** One My Tasks bucket: a titled section with its count and task cards. In focus
 * mode each card gets a bucket picker to re-file it. Renders + delegates. */
export function MyTasksBucket({
  bucket,
  showFocusPicker,
  onToggleDone,
  onSetBucket,
}: {
  bucket: TaskBucket;
  showFocusPicker: boolean;
  onToggleDone: (input: { id: string; done: boolean; now: string }) => void;
  onSetBucket: (input: { id: string; myBucket: FocusBucket }) => void;
}) {
  return (
    <section className="mytasks__bucket" data-testid={`bucket-${bucket.key}`}>
      <h2 className="mytasks__bucket-head">
        {bucket.label}
        <span className="mytasks__bucket-count">{bucket.tasks.length}</span>
      </h2>
      <ul className="mytasks__list">
        {bucket.tasks.map((task) => (
          <li key={task.id} className="mytasks__row">
            <TaskCard
              task={task}
              onToggleDone={(t) =>
                onToggleDone({ id: t.id, done: t.status !== 'DONE', now: nowISO() })
              }
            />
            {showFocusPicker && (
              <FocusBucketPicker
                task={task}
                onChange={(myBucket) => onSetBucket({ id: task.id, myBucket })}
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
