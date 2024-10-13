import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { LuxonModule } from 'luxon-angular';

import { components } from 'src/app/shared/components';
import { directives } from 'src/app/shared/directives';
import { httpInterceptors } from 'src/app/shared/interceptors';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { pipes } from 'src/app/shared/pipes';
import { services } from 'src/app/shared/services';

@NgModule({
  declarations: [
    ...components,
    ...directives,
    ...pipes,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    LuxonModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslocoModule,
  ],
  exports: [
    ...components,
    ...directives,
    ...pipes,
    CommonModule,
    FlexLayoutModule,
    LuxonModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslocoModule,
  ],
  providers: [
    ...httpInterceptors,
    ...services,
  ],
})

export class SharedModule { }
