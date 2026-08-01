import { IonIcon } from '@ionic/react';
import { chevronDown, chevronForward } from 'ionicons/icons';
import { TaskCard } from '../task/TaskCard';
import { FocusBucketPicker } from './FocusBucketPicker';
import { useSectionCollapse } from '../board/useSectionCollapse';
import { nowISO } from '../task/today';
import type { TaskBucket } from './groupByDue';
import type { FocusBucket } from './groupByFocus';
import type { ProjectRef } from '../projects/useProjectsById';

/** One My Tasks bucket: a collapsible titled section with its count and task
 * cards, each labeled with its project (cross-project view). In focus mode each
 * card gets a bucket picker AND is drag-and-droppable between buckets (drop
 * re-files it here via onSetBucket; the select stays for a11y/mobile). The
 * collapse state persists (shared store, keyed by bucket key). */
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
  const { open, toggle } = useSectionCollapse(`mytasks-${bucket.key}`, true);
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
      <h2 className="mytasks__bucket-heading">
        <button
          type="button"
          className="mytasks__bucket-head"
          data-testid="bucket-toggle"
          aria-expanded={open}
          onClick={toggle}
        >
          <IonIcon icon={open ? chevronDown : chevronForward} aria-hidden="true" />
          {bucket.label}
          <span className="mytasks__bucket-count">{bucket.tasks.length}</span>
        </button>
      </h2>
      {open && (
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
      )}
    </section>
  );
}
