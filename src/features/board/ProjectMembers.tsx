import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { closeOutline, personAddOutline } from 'ionicons/icons';
import { isValidEmail } from '../projects/memberList';

/** Project sharing UI: the member emails (the first is the owner, not removable)
 * with a remove button each, plus an add-by-email input. Presentational + local
 * draft state; add/remove are delegated to useProjectMembers. */
export function ProjectMembers({
  members,
  busy,
  onAdd,
  onRemove,
}: {
  members: string[];
  busy?: boolean;
  onAdd: (email: string) => void;
  onRemove: (email: string) => void;
}) {
  const [email, setEmail] = useState('');
  const submit = () => {
    if (!isValidEmail(email)) return;
    onAdd(email);
    setEmail('');
  };

  return (
    <section className="project-members" data-testid="project-members">
      <h2 className="project-members__head">Shared with</h2>
      <ul className="project-members__list">
        {members.map((m, i) => (
          <li key={m} className="project-members__row" data-testid="member-row">
            <span className="project-members__email">{m}</span>
            {i === 0 ? (
              <span className="project-members__owner">Owner</span>
            ) : (
              <button
                type="button"
                className="project-members__remove"
                data-testid="member-remove"
                aria-label={`Remove ${m}`}
                disabled={busy}
                onClick={() => onRemove(m)}
              >
                <IonIcon icon={closeOutline} />
              </button>
            )}
          </li>
        ))}
      </ul>
      <div className="project-members__add">
        <IonIcon icon={personAddOutline} aria-hidden="true" />
        <input
          className="project-members__input"
          data-testid="member-email"
          type="email"
          placeholder="Invite by email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <button
          type="button"
          className="project-members__invite"
          data-testid="member-invite"
          disabled={busy || !isValidEmail(email)}
          onClick={submit}
        >
          Invite
        </button>
      </div>
    </section>
  );
}
