import { Routes } from '@angular/router';
import { AuthModule } from 'src/app/auth/auth.module';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: (): Promise<any> => import('src/app/landing/landing.component').then(m => m.LandingComponent),
  },
  {
    path: 'oops',
    pathMatch: 'full',
    loadComponent: (): Promise<any> => import('src/app/shared/components/oops/oops.component').then(m => m.OopsComponent),
  },
  {
    path: 'auth',
    loadChildren: (): Promise<any> =>
      import('src/app/auth/auth.module').then((module: typeof import('src/app/auth/auth.module')): AuthModule => module.AuthModule),
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
