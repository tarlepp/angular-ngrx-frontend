import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingRoutingModule } from 'src/app/landing/landing-routing.module';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/landing',
  },
  {
    path: '**',
    redirectTo: '/landing',
  },
];

@NgModule({
  imports: [
    LandingRoutingModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
})

export class AppRoutingModule { }
