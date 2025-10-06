import { Addemployee } from './Pages/home/components/addemployee/addemployee';
import { ProjectDetails } from './Pages/project-details/project-details';
import { Routes } from '@angular/router';
import { authGuard } from './Core/guards/auth.guard';
import { isAuthGuard } from './Core/guards/is-auth.guard';
import { MainOutlet } from './Layout/main-outlet/main-outlet';
import { Home } from './Pages/home/home';
import { MainlayoutNonNav } from './Layout/mainlayout-non-nav/mainlayout-non-nav';

export const routes: Routes = [
  {
    path: '',
    component: MainOutlet,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },
      {
        path: 'home',
        component: Home,
      },
         {
        path: 'addemployee',
        loadComponent: () =>
          import('./Pages/home/components/addemployee/addemployee').then(m => m.Addemployee),
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('./Pages/client/client').then(m => m.Client),
      },

      {
        path: 'signup',
        loadComponent: () =>
          import('./Pages/Auth/signup/signup').then(m => m.Signup),
      },

      {
        path: 'createaccount',
        loadComponent: () =>
          import('./Pages/Auth/create-account/create-account').then(m => m.CreateAccount),
      },

      {
        path: 'feedback',
        loadComponent: () =>
          import('./Pages/feed-back-page/feed-back-page').then(m => m.FeedBackPage),
      },
        {
        path: 'client/:id',
        loadComponent: () =>
          import('./Pages/client-profile/client-profile').then(m => m.ClientProfile),
      },
      {
        path: 'profile/:id',
        loadComponent: () =>
          import('./Pages/profile/profile').then(m => m.Profile),
      },

      {
        path: 'notifications',
        loadComponent: () =>
          import('./Pages/notifaction/notifaction').then(m => m.Notifaction),
      },
      {
        path: 'projectDetails/:id',
        loadComponent: () =>
          import('./Pages/project-details/project-details').then(m => m.ProjectDetails),
      },
    ]
  },
  {
    path: '',
    component: MainlayoutNonNav,
    children: [
      {
        path: 'client/:id',
        loadComponent: () =>
          import('./Pages/client-profile/client-profile').then(m => m.ClientProfile),
      },
      {
        path: 'profile/:id',
        loadComponent: () =>
          import('./Pages/profile/profile').then(m => m.Profile),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./Pages/notifaction/notifaction').then(m => m.Notifaction),
      },
      {
        path: 'projectDetails/:id',
        loadComponent: () =>
          import('./Pages/project-details/project-details').then(m => m.ProjectDetails),
      },

    ]
  },

];
