import { NgModule } from '@angular/core';

import { LandingRoutingModule } from 'src/app/landing/landing-routing.module';
import { LandingComponent } from 'src/app/landing/landing.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    LandingRoutingModule,
    LandingComponent,
  ],
})

export class LandingModule { }
