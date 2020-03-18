import { Routes } from '@angular/router';

import { AnonymousGuard } from 'src/app/auth/guards';
import { LoginComponent } from 'src/app/auth/login/login.component';

export const LoginRoutes: Routes = [
  {
    path: 'login',
    canActivate: [
      AnonymousGuard,
    ],
    component: LoginComponent,
    children: [
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];
