import { useQuery } from '@tanstack/react-query';
import { safeHref } from './safeHref';
import { attachmentFileUrl } from './attachmentFileApi';
import type { AttachmentRecord } from '../../lib/dataClient';

/** One attachment row: a LINK (safeHref-guarded href) or an uploaded FILE
 * (storageKey resolved to a signed download URL). Both open in a new tab; each
 * has a remove button. */
export function AttachmentItem({
  attachment,
  onRemove,
}: {
  attachment: AttachmentRecord;
  onRemove: (id: string) => void;
}) {
  const isFile = !!attachment.storageKey;
  const { data: fileUrl } = useQuery({
    queryKey: ['attachment-file', attachment.storageKey],
    queryFn: () => attachmentFileUrl(attachment.storageKey),
    enabled: isFile,
    staleTime: 5 * 60_000,
  });
  const href = isFile ? fileUrl : safeHref(attachment.url);
  const label = attachment.title || (isFile ? 'File' : attachment.url);
  return (
    <li className="attachment" data-testid="attachment">
      {href ? (
        <a className="attachment__link" href={href} target="_blank" rel="noreferrer noopener">
          {isFile ? `📎 ${label}` : label}
        </a>
      ) : (
        <span className="attachment__link attachment__link--bad">{label}</span>
      )}
      <button
        type="button"
        className="attachment__remove"
        data-testid="attachment-remove"
        aria-label={`Remove ${label}`}
        onClick={() => onRemove(attachment.id)}
      >
        ✕
      </button>
    </li>
  );
}
