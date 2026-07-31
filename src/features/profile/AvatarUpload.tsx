import { useRef } from 'react';
import { useAvatar } from './useAvatar';

/** The You-tab avatar: shows the uploaded picture (or an initials fallback) with
 * a button to pick a new image. Uploads via useAvatar; the initials are the
 * fallback while none is set. */
export function AvatarUpload({ fallback }: { fallback: string }) {
  const { url, upload } = useAvatar();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="avatar-upload" data-testid="avatar-upload">
      {url ? (
        <img
          className="avatar-upload__img"
          data-testid="avatar-image"
          src={url}
          alt="Your avatar"
        />
      ) : (
        <div className="profile__avatar" data-testid="avatar-fallback" aria-hidden="true">
          {fallback}
        </div>
      )}
      <button
        type="button"
        className="avatar-upload__btn"
        data-testid="avatar-pick"
        disabled={upload.isPending}
        onClick={() => fileRef.current?.click()}
      >
        {upload.isPending ? 'Uploading…' : 'Change photo'}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="avatar-upload__file"
        data-testid="avatar-file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload.mutate(file);
        }}
      />
    </div>
  );
}
