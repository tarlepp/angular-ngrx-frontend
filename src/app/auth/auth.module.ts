import { NgModule } from '@angular/core';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { LocalStorageService, NgxWebstorageModule } from 'ngx-webstorage';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginModule } from './login/login.module';
import { jwtOptionsFactory } from './factories';
import { Guards } from './guards';
import { Services } from './services';

@NgModule({
  imports: [
    AuthRoutingModule,
    LoginModule,
    NgxWebstorageModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [LocalStorageService],
      },
    }),
  ],
  providers: [
    ...Services,
    ...Guards,
  ],
})

export class AuthModule { }
