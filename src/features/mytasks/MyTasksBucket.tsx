import { TaskCard } from '../task/TaskCard';
import { FocusBucketPicker } from './FocusBucketPicker';
import { nowISO } from '../task/today';
import type { TaskBucket } from './groupByDue';
import type { FocusBucket } from './groupByFocus';
import type { ProjectRef } from '../projects/useProjectsById';

/** One My Tasks bucket: a titled section with its count and task cards, each
 * labeled with its project (cross-project view). In focus mode each card gets a
 * bucket picker AND is drag-and-droppable between buckets (drop re-files it here
 * via onSetBucket; the select stays for a11y/mobile). Renders + delegates. */
export function MyTasksBucket({
  bucket,
  showFocusPicker,
  projectsById,
  onToggleDone,
  onSetBucket,
}: {
  bucket: TaskBucket;
  showFocusPicker: boolean;
  projectsById: Map<string, ProjectRef>;
  onToggleDone: (input: { id: string; done: boolean; now: string }) => void;
  onSetBucket: (input: { id: string; myBucket: FocusBucket }) => void;
}) {
  // Focus mode only: dropping a dragged task re-files it to THIS bucket.
  const drop = showFocusPicker
    ? {
        onDragOver: (e: React.DragEvent) => e.preventDefault(),
        onDrop: (e: React.DragEvent) => {
          e.preventDefault();
          const id = e.dataTransfer.getData('text/plain');
          if (id) onSetBucket({ id, myBucket: bucket.key as FocusBucket });
        },
      }
    : {};
  return (
    <section className="mytasks__bucket" data-testid={`bucket-${bucket.key}`} {...drop}>
      <h2 className="mytasks__bucket-head">
        {bucket.label}
        <span className="mytasks__bucket-count">{bucket.tasks.length}</span>
      </h2>
      <ul className="mytasks__list">
        {bucket.tasks.map((task) => (
          <li
            key={task.id}
            className="mytasks__row"
            draggable={showFocusPicker}
            onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
          >
            <TaskCard
              task={task}
              project={projectsById.get(task.projectId)}
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
