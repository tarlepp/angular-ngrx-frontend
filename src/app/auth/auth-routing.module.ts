import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { loginRoutes } from 'src/app/auth/login/login.routes';

@NgModule({
  imports: [
    RouterModule.forChild([
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
    ]),
  ],
  exports: [
    RouterModule,
  ],
})

export class AuthRoutingModule { }
