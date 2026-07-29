import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import type { GroupMode } from './groupMode';

/** Segmented "Group by" switch for My Tasks (due date vs priority). Renders
 * only; the chosen mode is owned + persisted by useMyTasks. */
export function GroupBySegment({
  mode,
  onChange,
}: {
  mode: GroupMode;
  onChange: (mode: GroupMode) => void;
}) {
  return (
    <IonSegment
      className="mytasks__group"
      value={mode}
      data-testid="mytasks-groupby"
      onIonChange={(e) => onChange(e.detail.value as GroupMode)}
    >
      <IonSegmentButton value="due" data-testid="groupby-due">
        <IonLabel>Due date</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="priority" data-testid="groupby-priority">
        <IonLabel>Priority</IonLabel>
      </IonSegmentButton>
    </IonSegment>
  );
}
