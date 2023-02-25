import { inject } from '@angular/core';
import { ActivatedRoute, Routes, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AnonymousGuard } from 'src/app/auth/guards';
import { LoginComponent } from 'src/app/auth/login/login.component';

export const loginRoutes: Routes = [
  {
    path: 'login',
    canActivate: [
      (): Observable<boolean|UrlTree> => inject(AnonymousGuard).canActivate(inject(ActivatedRoute)),
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
