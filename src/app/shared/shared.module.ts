import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from 'src/app/shared/material/material.module';
import { Components } from 'src/app/shared/components';
import { Directives } from 'src/app/shared/directives';
import { HttpInterceptors } from 'src/app/shared/interceptors';
import { Services } from 'src/app/shared/services';
import { Pipes } from 'src/app/shared/pipes';

@NgModule({
  declarations: [
    ...Components,
    ...Directives,
    ...Pipes,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
  ],
  exports: [
    ...Components,
    ...Directives,
    ...Pipes,
    BrowserAnimationsModule,
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
  ],
  providers: [
    ...HttpInterceptors,
    ...Services,
  ],
})

export class SharedModule { }
