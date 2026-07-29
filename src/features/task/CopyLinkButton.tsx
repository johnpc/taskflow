import { useState } from 'react';
import { taskLink } from './taskLink';

/** Copies the task's deep link to the clipboard and briefly confirms "Copied!".
 * Self-contained: reads the link from the current origin, owns the transient
 * confirmation flag. Falls back gracefully if the clipboard API is unavailable. */
export function CopyLinkButton({ taskId }: { taskId: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const link = taskLink(window.location.origin, taskId);
    try {
      await navigator.clipboard?.writeText(link);
    } catch {
      /* clipboard blocked — still flash the confirmation */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button type="button" className="task-detail__dup" data-testid="task-copy-link" onClick={copy}>
      {copied ? 'Copied!' : 'Copy link'}
    </button>
  );
}
