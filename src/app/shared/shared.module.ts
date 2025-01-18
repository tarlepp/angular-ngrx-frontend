import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { LuxonModule } from 'luxon-angular';

import { components } from 'src/app/shared/components';
import { directives } from 'src/app/shared/directives';
import { httpInterceptors } from 'src/app/shared/interceptors';

import { pipes } from 'src/app/shared/pipes';
import { services } from 'src/app/shared/services';

@NgModule({
  imports: [
    ...components,
    ...directives,
    ...pipes,
    CommonModule,
    FlexLayoutModule,
    LuxonModule,
    ReactiveFormsModule,
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
    TranslocoModule,
],
  providers: [
    ...httpInterceptors,
    ...services,
  ],
})

export class SharedModule { }
