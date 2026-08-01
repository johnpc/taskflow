import { ProjectCard } from './ProjectCard';
import type { Progress } from './taskCounts';
import type { ProjectRecord } from '../../lib/dataClient';

/** A labeled group of project cards (e.g. "Starred" / "All projects"). Renders
 * nothing when empty so an absent group leaves no stray heading. Presentational
 * — counts/progress/favorite-toggle are threaded from the Projects tab. */
export function ProjectSection({
  label,
  projects,
  counts,
  progress,
  onToggleFavorite,
  testid,
}: {
  label: string;
  projects: ProjectRecord[];
  counts: Map<string, number>;
  progress: Map<string, Progress>;
  onToggleFavorite: (p: ProjectRecord) => void;
  testid: string;
}) {
  if (projects.length === 0) return null;
  return (
    <section className="projects__section" data-testid={testid}>
      <h2 className="projects__section-head">{label}</h2>
      <ul className="projects__list" aria-label={label}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            count={counts.get(project.id) ?? 0}
            progress={progress.get(project.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </ul>
    </section>
  );
}
