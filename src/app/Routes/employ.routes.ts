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
        path: 'projectDetails/:id',
        loadComponent: () =>
          import('../Pages/Interfaces_Employee/projectDetalis/project-details').then(m => m.ProjectDetails),
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
