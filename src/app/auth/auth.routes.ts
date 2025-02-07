import { Routes } from '@angular/router';

import { loginRoutes } from 'src/app/auth/login/login.routes';

export const authRoutes: Routes = [
  {
    path: '',
    children: [
      ...loginRoutes,
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];
