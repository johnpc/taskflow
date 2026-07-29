import { Link } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import {
  homeOutline,
  albumsOutline,
  checkmarkDoneOutline,
  searchOutline,
  personCircleOutline,
} from 'ionicons/icons';
import './tabBar.css';

/** Bottom tab bar. Home is the dashboard landing; Projects lists the workspace;
 * My Tasks is everything due across projects; Search finds any task; You is the
 * profile + theme settings. (Calendar is reachable from Home + My Tasks.) */
const TABS: { label: string; icon: string; to: string }[] = [
  { label: 'Home', icon: homeOutline, to: '/home' },
  { label: 'Projects', icon: albumsOutline, to: '/projects' },
  { label: 'My Tasks', icon: checkmarkDoneOutline, to: '/my-tasks' },
  { label: 'Search', icon: searchOutline, to: '/search' },
  { label: 'You', icon: personCircleOutline, to: '/you' },
];

export function TabBar({ active = 'Projects' }: { active?: string }) {
  return (
    <nav className="tab-bar" aria-label="Primary">
      {TABS.map(({ label, icon, to }) => {
        const className = label === active ? 'tab-bar__tab tab-bar__tab--active' : 'tab-bar__tab';
        const current = label === active ? 'page' : undefined;
        return (
          <Link key={label} to={to} className={className} aria-current={current} aria-label={label}>
            <IonIcon className="tab-bar__icon" icon={icon} aria-hidden="true" />
            <span className="tab-bar__label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
