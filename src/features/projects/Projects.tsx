import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useProjects, useCreateProject, useToggleFavorite } from './useProjects';
import { useProjectCounts } from './useProjectCounts';
import { useProjectProgress } from './useProjectProgress';
import { ArchivedSection } from './ArchivedSection';
import { useTemplates } from '../templates/useTemplates';
import { ProjectCard } from './ProjectCard';
import { NewProjectButton } from './NewProjectButton';
import { TemplatePicker } from '../templates/TemplatePicker';
import { LoadState } from '../shell/LoadState';
import { TabBar } from '../shell/TabBar';
import { useDocumentTitle } from '../shell/useDocumentTitle';
import type { ProjectRecord } from '../../lib/dataClient';
import './projects.css';

/** Projects tab — the workspace home. Lists the owner's projects with a favorite
 * toggle, an inline "New project" composer, and template quick-starts. */
export function Projects() {
  useDocumentTitle('Projects');
  const history = useHistory();
  const { data: projects, isLoading, isError, refetch } = useProjects();
  const create = useCreateProject();
  const toggle = useToggleFavorite();
  const counts = useProjectCounts();
  const progress = useProjectProgress();
  const template = useTemplates();
  const list = projects ?? [];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Projects</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1 className="tf-heading projects__title">Your projects</h1>
        <p className="tf-muted projects__subtitle">Everything you’re working on, in one place.</p>
        <NewProjectButton
          busy={create.isPending}
          onCreate={(name) => create.mutate({ name, existingCount: list.length })}
        />
        <TemplatePicker
          busy={template.isPending}
          onPick={(t) =>
            template.mutate(
              { template: t, sortOrder: list.length },
              { onSuccess: (id) => history.push(`/projects/${id}`) },
            )
          }
        />
        <LoadState
          isLoading={isLoading}
          isError={isError}
          isEmpty={list.length === 0}
          onRetry={refetch}
          emptyTitle="No projects yet"
          emptyMessage="Create your first project above to start organizing your work."
        >
          <ul className="projects__list" aria-label="Projects">
            {list.map((project: ProjectRecord) => (
              <ProjectCard
                key={project.id}
                project={project}
                count={counts.get(project.id) ?? 0}
                progress={progress.get(project.id)}
                onToggleFavorite={(p) => toggle.mutate({ id: p.id, favorite: !p.favorite })}
              />
            ))}
          </ul>
        </LoadState>
        <ArchivedSection />
        <TabBar active="Projects" />
      </IonContent>
    </IonPage>
  );
}
