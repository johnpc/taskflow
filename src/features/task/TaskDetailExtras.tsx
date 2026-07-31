import { Attachments } from './Attachments';
import { CustomFieldsRegion } from '../customfields/CustomFieldsRegion';
import { Comments } from './Comments';
import { CoverUpload } from './CoverUpload';
import { ActivityFeed } from './ActivityFeed';
import type { TaskDetailHook } from './useTaskDetail';
import type { TaskRecord } from '../../lib/dataClient';

/** The lower "extras" cluster of task detail: attachments, custom fields, and
 * comments. Split from TaskDetailBody so that composer stays under the line
 * limit; all three read the loaded detail query + delegate mutations up. */
export function TaskDetailExtras({ task, hook }: { task: TaskRecord; hook: TaskDetailHook }) {
  const { query, patch, comments, attachments, email } = hook;
  return (
    <>
      <CoverUpload task={task} />
      <Attachments
        attachments={query.data?.attachments ?? []}
        busy={attachments.add.isPending || attachments.addFile.isPending}
        onAdd={(input) => attachments.add.mutate(input)}
        onAddFile={(file) => attachments.addFile.mutate(file)}
        onRemove={(id) => attachments.remove.mutate(id)}
      />
      <CustomFieldsRegion
        task={task}
        onPatch={(customValues) => patch.mutate({ id: task.id, customValues })}
      />
      <Comments
        comments={query.data?.comments ?? []}
        busy={comments.add.isPending}
        nowMs={Date.now()}
        currentEmail={email}
        onPost={(body) => comments.add.mutate(body)}
        onEdit={(input) => comments.edit.mutate(input)}
        onDelete={(id) => comments.remove.mutate(id)}
        onLike={(comment) => comments.like.mutate(comment)}
      />
      <ActivityFeed taskId={task.id} nowMs={Date.now()} />
    </>
  );
}
