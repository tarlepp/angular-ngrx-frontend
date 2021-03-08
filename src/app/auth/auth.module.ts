import { NgModule } from '@angular/core';

import { AuthRoutingModule } from 'src/app/auth/auth-routing.module';
import { Guards } from 'src/app/auth/guards';
import { LoginModule } from 'src/app/auth/login/login.module';
import { authenticationServices } from 'src/app/auth/services';

@NgModule({
  imports: [
    AuthRoutingModule,
    LoginModule,
  ],
  providers: [
    ...authenticationServices,
    ...Guards,
  ],
})

export class AuthModule { }
