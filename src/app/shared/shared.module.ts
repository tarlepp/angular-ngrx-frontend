import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'ngx-moment';

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
    ReactiveFormsModule,
    MaterialModule,
    MomentModule,
    TranslateModule,
  ],
  exports: [
    ...components,
    ...directives,
    ...pipes,
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule,
    MomentModule,
    TranslateModule,
  ],
  providers: [
    ...httpInterceptors,
    ...services,
  ],
})

export class SharedModule { }
