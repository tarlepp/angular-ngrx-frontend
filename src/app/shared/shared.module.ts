import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from './material/material.module';
import { Components } from './components';
import { Directives } from './directives';
import { HttpInterceptors } from './interceptors';
import { Services } from './services';

@NgModule({
  declarations: [
    ...Components,
    ...Directives,
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
