import type { DragEvent } from 'react';
import { projectColorVar } from '../projects/projectColors';
import type { TaskRecord } from '../../lib/dataClient';

/** Build the `<li>` presentation props for a task card: the optional
 * color-accent left stripe and the drop-target handlers (when droppable).
 * Pulled out of TaskCard so the component stays within the line limit. */
export function taskCardShell(color: TaskRecord['color'], onDropTask?: () => void) {
  const style = color
    ? { borderLeftColor: projectColorVar(color), borderLeftWidth: '4px' }
    : undefined;
  const drop = onDropTask
    ? {
        onDragOver: (e: DragEvent) => e.preventDefault(),
        onDrop: (e: DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          onDropTask();
        },
      }
    : {};
  return { style, colored: color ? ('true' as const) : undefined, drop };
}
