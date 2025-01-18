import { NgModule } from '@angular/core';

import { LoginComponent } from 'src/app/auth/login/login.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    LoginComponent,
  ],
})

export class LoginModule { }
