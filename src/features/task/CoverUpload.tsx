import { useRef } from 'react';
import { useTaskCover } from './useTaskCover';
import type { TaskRecord } from '../../lib/dataClient';

/** Task-detail cover control: shows the current cover (if any) and a button to
 * pick/replace the image. Uploads via useTaskCover; the board card re-renders
 * with the new cover on success. */
export function CoverUpload({ task }: { task: Pick<TaskRecord, 'id' | 'coverKey'> }) {
  const { url, upload } = useTaskCover(task);
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <section className="cover-upload" data-testid="cover-upload">
      <h2 className="subtasks__head">Cover image</h2>
      {url && <img className="cover-upload__img" data-testid="cover-preview" src={url} alt="" />}
      <button
        type="button"
        className="cover-upload__btn"
        data-testid="cover-pick"
        disabled={upload.isPending}
        onClick={() => fileRef.current?.click()}
      >
        {upload.isPending ? 'Uploading…' : url ? 'Replace cover' : 'Add a cover image'}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="cover-upload__file"
        data-testid="cover-file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload.mutate(file);
        }}
      />
    </section>
  );
}
