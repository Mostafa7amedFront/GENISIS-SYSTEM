import { Routes } from "@angular/router";
import { MainOutlet } from "../Layout/main-outlet/main-outlet";
import { roleGuard } from "../Core/guards/role.guard";
import { Home } from "../Pages/home/home";
import { MainlayoutEmployee } from "../Layout/Employee/mainlayout-employee/mainlayout-employee";
import { Myprofile } from "../Pages/Interfaces_Employee/myprofile/myprofile";

export const employeroutes: Routes = [
  {
    path: 'employee',
    component: MainlayoutEmployee,
    canActivate:[roleGuard(["employee"])],
    children: [
    { path: '', pathMatch: 'full', redirectTo: 'proflie' },
      {
        path: 'proflie',
        component: Myprofile,
      },
    
      {
        path:'projects',
        loadComponent:()=> import('../Pages/Interfaces_Employee/myprojects/myprojects').then(m => m.Myprojects)
      },
        {
        path: 'updateStats/:id',
        loadComponent: () =>
          import('../Pages/Interfaces_Employee/projectDetalis/components/update-campaign-stats/update-campaign-stats').then(m => m.UpdateCampaignStats),
      },
  {
        path: 'updateSummary/:id',
        loadComponent: () =>
          import('../Pages/Interfaces_Employee/projectDetalis/components/update-summary/update-summary').then(m => m.UpdateSummary),
      },
           {
        path: 'add-media-buying/:id',
        loadComponent: () =>
          import('../Pages/projects/projectDetalis/components/add-media-buying/add-media-buying').then(m => m.AddMediaBuying),
      },

     {
        path: 'projectDetails/:id',
        loadComponent: () =>
          import('../Pages/Interfaces_Employee/projectDetalis/project-details').then(m => m.ProjectDetails),
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
      },
      {
        path: 'feedback',
        loadComponent: () =>
          import('../Pages/Interfaces_Employee/feedback-employees/feedback-employees').then(m => m.FeedbackEmployees),
      },

      {
        path: 'notifications',
        loadComponent: () =>
          import('../Pages/notifaction/notifaction').then(m => m.Notifaction),
      },

    ]
  },
  

];
