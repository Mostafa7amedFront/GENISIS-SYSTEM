import { Employees } from './../Core/service/employees';
import { Routes } from "@angular/router";
import { MainOutlet } from "../Layout/main-outlet/main-outlet";
import { roleGuard } from "../Core/guards/role.guard";
import { Home } from "../Pages/home/home";

export const adminroutes: Routes = [
  {
    path: '',
    component: MainOutlet,
   canActivate: [roleGuard(['admin', 'superadmin'])],

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
          import('../Pages/home/components/addemployee/addemployee').then(m => m.Addemployee),
      },

      {
        path: 'editemployee/:id',
        loadComponent: () =>
          import('../Pages/home/components/editemployee/editemployee').then(m => m.Editemployee),
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('../Pages/client/client').then(m => m.Client),
      },
      {
        path: 'arrival',
        loadComponent: () =>
          import('../Pages/arrival/arrival').then(m => m.Arrival),
      },
      {
        path: 'projects',
        loadComponent: () => import('../Pages/projects/projects/projects').then(m => m.Projects)
      },
      {
        path: 'addclient',
        loadComponent: () =>
          import('../Pages/client/components/addclients/addclients').then(m => m.Addclients),
      },
      {
        path: 'editclient/:id',
        loadComponent: () =>
          import('../Pages/client/components/editclients/editclients').then(m => m.Editclients),
      },
      {
        path: 'addpayment',
        loadComponent: () =>
          import('../Pages/add-payments/add-payments').then(m => m.AddPayments),
      },
      {
        path: 'payment',
        loadComponent: () =>
          import('../Pages/payments-admin/payments-admin').then(m => m.PaymentsAdmin),
      },
      {
        path: 'createaccount',
        loadComponent: () =>
          import('../Pages/Auth/create-account/create-account').then(m => m.CreateAccount),
      },
      {
        path: 'addproject',
        loadComponent: () =>
          import('../Pages/projects/addproject/addproject').then(m => m.Addproject),
      },
      {
        path: 'editproject/:id',
        loadComponent: () =>
          import('../Pages/projects/editproject/editproject').then(m => m.Editproject),
      },

      {
        path: 'feedback/:id',
        loadComponent: () =>
          import('../Pages/add-feedback-employee/add-feedback-employee').then(m => m.AddFeedbackEmployee),
      },
      {
        path: 'client/:id',
        loadComponent: () =>
          import('../Pages/client-profile/client-profile').then(m => m.ClientProfile),
      },
      {
        path: 'profile/:id',
        loadComponent: () =>
          import('../Pages/profile/profile').then(m => m.Profile),
      },
      {
        path: 'service',
        loadComponent: () =>
          import('../Pages/service/service').then(m => m.Service),
      },
      {
        path: 'addservice',
        loadComponent: () => import('../Pages/service/components/addservice/addservice').then(m => m.Addservice)
      },
      {
        path: 'editservice/:id',
        loadComponent: () => import('../Pages/service/components/editservice/editservice').then(m => m.Editservice)
      },
      {
        path: 'updateStats/:id',
        loadComponent: () =>
          import('../Pages/projects/projectDetalis/components/update-campaign-stats/update-campaign-stats').then(m => m.UpdateCampaignStats),
      },
      {
        path: 'updateSummary/:id',
        loadComponent: () =>
          import('../Pages/projects/projectDetalis/components/update-summary/update-summary').then(m => m.UpdateSummary),
      },
      {
        path: 'add-media-buying/:id',
        loadComponent: () =>
          import('../Pages/projects/projectDetalis/components/add-media-buying/add-media-buying').then(m => m.AddMediaBuying),
      },
      {
        path: 'getfeedback/:id',
        loadComponent: () =>
          import('../Pages/get-feedback/get-feedback').then(m => m.GetFeedback),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('../Pages/notifaction/notifaction').then(m => m.Notifaction),
      },
      {
        path: 'projectDetails/:id',
        loadComponent: () =>
          import('../Pages/projects/projectDetalis/project-details')
            .then(m => m.ProjectDetails),
        children: [
          {
            path: '',
            redirectTo: 'posts/add',
            pathMatch: 'full'
          },
          {
            path: 'posts',
            loadComponent: () =>
              import('../Pages/projects/projectDetalis/components/posts/posts')
                .then(m => m.Posts)
          },
          {
            path: 'posts/add',
            loadComponent: () =>
              import('../Pages/projects/projectDetalis/components/addpost/addpost')
                .then(m => m.Addpost)
          },
          {
            path: 'posts/:id',
            loadComponent: () =>
              import('../Pages/projects/projectDetalis/components/show-post/show-post')
                .then(m => m.ShowPost)
          }
        ]
      }

    ]
  },


];
