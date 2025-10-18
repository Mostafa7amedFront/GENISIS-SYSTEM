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
    canActivate:[authGuard],
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
        path: 'editemployee/:id',
        loadComponent: () =>
          import('./Pages/home/components/editemployee/editemployee').then(m => m.Editemployee),
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('./Pages/client/client').then(m => m.Client),
      },
      {
        path:'projects',
        loadComponent:()=> import('./Pages/projects/projects/projects').then(m => m.Projects)
      },
      {
        path: 'addclient',
        loadComponent: () =>
          import('./Pages/client/components/addclients/addclients').then(m => m.Addclients),
      },
           {
        path: 'editclient/:id',
        loadComponent: () =>
          import('./Pages/client/components/editclients/editclients').then(m => m.Editclients),
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
        path: 'addproject',
        loadComponent: () =>
          import('./Pages/projects/addproject/addproject').then(m => m.Addproject),
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
        path: 'service',
        loadComponent: () =>
          import('./Pages/service/service').then(m => m.Service),
      },
      {
        path:'addservice',
        loadComponent : () => import('./Pages/service/components/addservice/addservice').then(m => m.Addservice)
      },
       {
        path:'editservice/:id',
        loadComponent : () => import('./Pages/service/components/editservice/editservice').then(m => m.Editservice)
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./Pages/notifaction/notifaction').then(m => m.Notifaction),
      },
      {
        path: 'projectDetails/:id',
        loadComponent: () =>
          import('./Pages/projects/projectDetalis/project-details').then(m => m.ProjectDetails),
      },
    ]
  },
  {
    path: '',
    component: MainlayoutNonNav,
    canActivate:[isAuthGuard],
    children: [
           {
        path: 'login',
        loadComponent: () =>
          import('./Pages/Auth/login/login').then(m => m.Login),
      },
    ]
  },

];
