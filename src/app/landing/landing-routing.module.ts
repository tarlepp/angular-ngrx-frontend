import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LandingComponent } from 'src/app/landing/landing.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'landing',
        component: LandingComponent,
        children: [
          {
            path: '**',
            redirectTo: 'landing',
          },
        ],
      },
    ]),
  ],
  exports: [
    RouterModule,
  ],
})

export class LandingRoutingModule { }
