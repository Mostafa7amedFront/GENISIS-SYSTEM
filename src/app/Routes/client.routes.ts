import { Routes } from '@angular/router';
import { MainlayoutClients } from '../Layout/Clients/mainlayout-clients/mainlayout-clients';
import { roleGuard } from '../Core/guards/role.guard';
import { MyProfileClient } from '../Pages/Interfaces_Clients/my-profile-client/my-profile-client';


export const clientRoutes: Routes = [
  {
    path: 'client',
    component: MainlayoutClients,
    canActivate: [roleGuard(['client'])],
    children: [
       { path: '', pathMatch: 'full', redirectTo: 'proflie' },

      {
        path: 'proflie',
        pathMatch: 'full',
        component: MyProfileClient
      },
      {
        path:'projects',
        loadComponent:()=> import('../Pages/Interfaces_Clients/myprojects/myprojects').then(m => m.Myprojects)
      },
      {
        path: 'projectDetails/:id',
        loadComponent: () =>
          import('../Pages/Interfaces_Clients/projectDetalis/project-details').then(m => m.ProjectDetails),
      },
      {
        path: 'feedback',
        loadComponent: () =>
          import('../Pages/Interfaces_Clients/feedbackclient/feedbackclient').then(m => m.Feedbackclient),
      },
          {
        path: 'payments',
        loadComponent: () =>
          import('../Pages/Interfaces_Clients/payments/payments').then(m => m.Payments),
      },
        {
        path: 'meeting',
        loadComponent: () =>
          import('../Pages/Interfaces_Clients/set-meeting/set-meeting').then(m => m.SetMeeting),
      },
        {
        path: 'addfeedback/:id',
        loadComponent: () =>
          import('../Pages/Interfaces_Clients/feed-back-page/feed-back-page').then(m => m.FeedBackPage),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('../Pages/notifaction/notifaction').then(m => m.Notifaction),
      },
    ]
  },
];
