import { Routes } from '@angular/router';


import { adminroutes } from './Routes/admin.routes';
import { employeroutes } from './Routes/employ.routes';
import { clientRoutes } from './Routes/client.routes';
import { authRoutes } from './Routes/auth.routes';


export const routes: Routes = [

  ...clientRoutes,
  ...adminroutes,
  ...employeroutes,
  ...authRoutes,


];
