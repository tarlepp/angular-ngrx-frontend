import { Routes } from '@angular/router';

import { LoginComponent } from 'src/app/auth/login/login.component';
import { AnonymousGuard } from 'src/app/auth/guards';

export const LoginRoutes: Routes = [
  {
    path: 'login',
    canActivate: [
      AnonymousGuard,
    ],
    component: LoginComponent,
  },
];
