import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'ngx-moment';

import { Components } from 'src/app/shared/components';
import { Directives } from 'src/app/shared/directives';
import { HttpInterceptors } from 'src/app/shared/interceptors';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { Pipes } from 'src/app/shared/pipes';
import { services } from 'src/app/shared/services';

@NgModule({
  declarations: [
    ...Components,
    ...Directives,
    ...Pipes,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule,
    MomentModule,
    TranslateModule,
  ],
  exports: [
    ...Components,
    ...Directives,
    ...Pipes,
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule,
    MomentModule,
    TranslateModule,
  ],
  providers: [
    ...HttpInterceptors,
    ...services,
  ],
})

export class SharedModule { }
