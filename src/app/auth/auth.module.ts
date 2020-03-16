import { NgModule } from '@angular/core';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { LocalStorageService, NgxWebstorageModule } from 'ngx-webstorage';

import { AuthRoutingModule } from 'src/app/auth/auth-routing.module';
import { LoginModule } from 'src/app/auth/login/login.module';
import { jwtOptionsFactory } from 'src/app/auth/factories';
import { Guards } from 'src/app/auth/guards';
import { Services } from 'src/app/auth/services';

@NgModule({
  imports: [
    AuthRoutingModule,
    LoginModule,
    NgxWebstorageModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [
          LocalStorageService,
        ],
      },
    }),
  ],
  providers: [
    ...Services,
    ...Guards,
  ],
})

export class AuthModule { }
