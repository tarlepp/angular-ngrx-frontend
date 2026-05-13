import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('src/app/landing/landing.component').then(m => m.LandingComponent),
  },
  {
    path: 'oops',
    pathMatch: 'full',
    loadComponent: () => import('src/app/shared/components/oops/oops.component').then(m => m.OopsComponent),
  },
  {
    path: 'auth',
    loadChildren: () => import('src/app/auth/auth.routes').then(m => m.authRoutes),
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
