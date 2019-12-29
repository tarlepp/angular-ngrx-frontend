import { NgModule } from '@angular/core';

import { LandingComponent } from './landing.component';
import { LandingRoutingModule } from './landing-routing.module';
import { SharedModule } from '../shared/shared.module';

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
