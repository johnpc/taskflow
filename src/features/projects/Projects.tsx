import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useProjects, useCreateProject, useToggleFavorite } from './useProjects';
import { ProjectCard } from './ProjectCard';
import { NewProjectButton } from './NewProjectButton';
import { LoadState } from '../shell/LoadState';
import { TabBar } from '../shell/TabBar';
import { useDocumentTitle } from '../shell/useDocumentTitle';
import type { ProjectRecord } from '../../lib/dataClient';
import './projects.css';

/** Projects tab — the workspace home. Lists the owner's projects with a favorite
 * toggle and an inline "New project" composer. Renders only; logic is in hooks. */
export function Projects() {
  useDocumentTitle('Projects');
  const { data: projects, isLoading, isError, refetch } = useProjects();
  const create = useCreateProject();
  const toggle = useToggleFavorite();
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
                onToggleFavorite={(p) => toggle.mutate({ id: p.id, favorite: !p.favorite })}
              />
            ))}
          </ul>
        </LoadState>
        <TabBar active="Projects" />
      </IonContent>
    </IonPage>
  );
}
