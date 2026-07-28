import { Redirect, Route } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import { Welcome } from './features/auth/Welcome';
import { SignIn } from './features/auth/SignIn';
import { SignUp } from './features/auth/SignUp';
import { RequireAuth } from './features/auth/RequireAuth';
import { Projects } from './features/projects/Projects';
import { ProjectView } from './features/board/ProjectView';
import { TaskDetail } from './features/task/TaskDetail';
import { MyTasks } from './features/mytasks/MyTasks';
import { Search } from './features/search/Search';
import { Profile } from './features/profile/Profile';
import { NotFound } from './features/shell/NotFound';

/** App routes. Taskflow is account-based: every workspace screen is wrapped in
 * RequireAuth (redirects signed-out visitors to /welcome). The auth screens
 * themselves are public. */
export function AppRoutes() {
  return (
    <IonRouterOutlet>
      <Route exact path="/welcome">
        <Welcome />
      </Route>
      <Route exact path="/signin">
        <SignIn />
      </Route>
      <Route exact path="/signup">
        <SignUp />
      </Route>
      <Route exact path="/projects">
        <RequireAuth>
          <Projects />
        </RequireAuth>
      </Route>
      <Route exact path="/projects/:id">
        <RequireAuth>
          <ProjectView />
        </RequireAuth>
      </Route>
      <Route exact path="/tasks/:id">
        <RequireAuth>
          <TaskDetail />
        </RequireAuth>
      </Route>
      <Route exact path="/my-tasks">
        <RequireAuth>
          <MyTasks />
        </RequireAuth>
      </Route>
      <Route exact path="/search">
        <RequireAuth>
          <Search />
        </RequireAuth>
      </Route>
      <Route exact path="/you">
        <RequireAuth>
          <Profile />
        </RequireAuth>
      </Route>
      <Route exact path="/">
        <Redirect to="/projects" />
      </Route>
      {/* Catch-all 404 — a pathless route matches anything above didn't. */}
      <Route>
        <NotFound />
      </Route>
    </IonRouterOutlet>
  );
}
