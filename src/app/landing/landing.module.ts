import { NgModule } from '@angular/core';

import { LandingRoutingModule } from 'src/app/landing/landing-routing.module';
import { LandingComponent } from 'src/app/landing/landing.component';

@NgModule({
  imports: [
    LandingRoutingModule,
    LandingComponent,
  ],
})

export class LandingModule { }
