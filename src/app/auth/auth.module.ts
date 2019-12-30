import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginModule } from './login/login.module';

@NgModule({
  imports: [
    AuthRoutingModule,
    LoginModule,
  ],
  providers: [
    ...Services,
    ...Guards,
  ],
})

export class AuthModule { }
