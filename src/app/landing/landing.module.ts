import { NgModule } from '@angular/core';

import { LandingComponent } from 'src/app/landing/landing.component';
import { LandingRoutingModule } from 'src/app/landing/landing-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    LandingComponent,
  ],
  imports: [
    SharedModule,
    LandingRoutingModule,
  ],
})

export class LandingModule { }
