import { Routes } from '@angular/router';
import { isAuthGuard } from '../Core/guards/is-auth.guard';
import { MainlayoutNonNav } from '../Layout/mainlayout-non-nav/mainlayout-non-nav';

export const authRoutes: Routes = [
  {
    path: '',
    component: MainlayoutNonNav,
    children: [
           
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      },
           {
        path: 'login',
        loadComponent: () =>
          import('../Pages/Auth/login/login').then(m => m.Login),
      },
    ]
  },
];
